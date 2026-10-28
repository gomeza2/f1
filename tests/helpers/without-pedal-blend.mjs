// Reverse only the declared 0.68 pedal correction for historical hashes and A/B tests.
// No force constants, yaw, handbrake, terrain or CPU instructions are normalized here.
export function withoutPedalBlend(source){
 return source
  .replace(' // Brake pressure releases drive torque; partial throttle blends engine drag continuously.\n const driveThrottle=throttle*(1-brake);\n','')
  .replace(' car.speed+=driveThrottle*accelerationAtSpeed(car.speed,model)*dt;',' car.speed+=throttle*accelerationAtSpeed(car.speed,model)*dt;')
  .replace(' car.speed-=(2.6*driveThrottle+DRIVING_TUNING.liftDrag*(1-driveThrottle))*dt;',' car.speed-=(throttle?2.6:DRIVING_TUNING.liftDrag)*dt;');
}
