export interface CircleBounds {
  x: number;
  y: number;
  radius: number;
}

export interface RectBounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

export class CollisionManager {
  public static checkCircleCollision(c1: CircleBounds, c2: CircleBounds): boolean {
    const dx = c1.x - c2.x;
    const dy = c1.y - c2.y;
    const distance = Math.hypot(dx, dy);
    return distance < c1.radius + c2.radius;
  }

  public static checkCircleRectCollision(circle: CircleBounds, rect: RectBounds): boolean {
    const closestX = Math.max(rect.x, Math.min(circle.x, rect.x + rect.width));
    const closestY = Math.max(rect.y, Math.min(circle.y, rect.y + rect.height));

    const distanceX = circle.x - closestX;
    const distanceY = circle.y - closestY;

    return Math.hypot(distanceX, distanceY) < circle.radius;
  }

  public static clampToBounds(
    entity: { x: number; y: number; radius: number },
    bounds: { width: number; height: number }
  ): void {
    entity.x = Math.max(entity.radius, Math.min(bounds.width - entity.radius, entity.x));
    entity.y = Math.max(entity.radius, Math.min(bounds.height - entity.radius, entity.y));
  }
}