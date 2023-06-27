
export function Teleport(PlayerCapsule, PerspectiveCamera)
{
    if(PerspectiveCamera.position.y <= -5)
    {
        PlayerCapsule.start.set(0, .5, 10);
        PlayerCapsule.end.set(0, 2, 10);
        PlayerCapsule.radius = .35;
        PerspectiveCamera.position.copy(PlayerCapsule.end);
        PerspectiveCamera.rotation.set(0, 0, 0);
    }
}

function PlayerCollisions(PVelocity, PlayerCapsule, WorldCollisions, POnGround)
{
    let Result = WorldCollisions.capsuleIntersect(PlayerCapsule);

    POnGround = false;

    if(Result)
    {
        POnGround = Result.normal.y > 0;

        if(!POnGround) PVelocity.addScaledVector(Result.normal, -Result.normal.dot(PVelocity));

        PlayerCapsule.translate(Result.normal.multiplyScalar(Result.depth));
    }
}

function GetForwardVector(PerspectiveCamera, PDirection)
{
    PerspectiveCamera.getWorldDirection(PDirection);
    PDirection.y = 0;
    PDirection.normalize();

    return PDirection;
}

function GetSideVector(PerspectiveCamera, PDirection)
{
    PerspectiveCamera.getWorldDirection(PDirection);
    PDirection.y = 0;
    PDirection.normalize();
    PDirection.cross(PerspectiveCamera.up);

    return PDirection;
}

export function PlayerPosition(deltaTime, PVelocity, PlayerCapsule, PerspectiveCamera, OrthographicCamera, POnGround, Gravity, WorldCollisions)
{
    let damping = Math.exp(-4 * deltaTime) - 1;

    if(!POnGround)
    {
        PVelocity.y -= Gravity * deltaTime;
        damping *= .1; // Air Resistance
    }

    PVelocity.addScaledVector(PVelocity, damping);

    const PPosition = PVelocity.clone().multiplyScalar(deltaTime);

    PlayerCapsule.translate(PPosition);

    PlayerCollisions(PVelocity, PlayerCapsule, WorldCollisions, POnGround);

    PerspectiveCamera.position.copy(PlayerCapsule.end);

    const Position = PlayerCapsule.end;

    OrthographicCamera.position.set(Position.x + 1, Position.y, Position.z + 2);

    OrthographicCamera.lookAt(PlayerCapsule.start);
}

export function PlayerControls(deltaTime, PVelocity, MoveSpeed, Jump, KeyStates, PerspectiveCamera, PDirection, POnGround)
{
    //const Speed = KeyStates['ShiftLeft'] ? RunSpeed : MoveSpeed;
    const Speed = deltaTime * (POnGround ? MoveSpeed : MoveSpeed * .5)

    if(KeyStates['KeyW']) PVelocity.add(GetForwardVector(PerspectiveCamera, PDirection).multiplyScalar(Speed));

    if(KeyStates['KeyA']) PVelocity.add(GetSideVector(PerspectiveCamera, PDirection).multiplyScalar(-Speed));

    if(KeyStates['KeyS']) PVelocity.sub(GetForwardVector(PerspectiveCamera, PDirection).multiplyScalar(Speed));

    if(KeyStates['KeyD']) PVelocity.sub(GetSideVector(PerspectiveCamera, PDirection).multiplyScalar(-Speed));

    if(POnGround && KeyStates['Space']) PVelocity.y = Jump;
}