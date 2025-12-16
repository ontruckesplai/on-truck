
export const calculateTheoreticalProgress = (contract, vehicles) => {
    if (!contract || !contract.asignaciones || contract.asignaciones.length === 0) return 0;

    const now = Date.now();
    const distance = contract.distance_km || 500; // default 500km
    const speed = 60; // km/h
    
    // Calculate discrete trips
    // Trip Logic:
    // 1. Travel to Dest: Distance / Speed
    // 2. Unload: 1 hour
    // 3. Return: Distance / Speed
    // 4. Load: 1 hour (Ready for next)
    // Cycle = (Distance/Speed * 2) + 2 hours
    // First Delivery Time = (Distance/Speed) + 1 hour (Travel + Unload)
    
    const travelTimeHours = distance / speed;
    const loadUnloadTimeHours = 1; 

    // Time to make FIRST delivery (One way + Unload)
    const firstDeliveryTimeMs = (travelTimeHours + loadUnloadTimeHours) * 3600 * 1000;
    
    // Time for subsequent deliveries (Return + Load + One Way + Unload) -> Full Cycle
    const cycleTimeMs = ((travelTimeHours * 2) + (loadUnloadTimeHours * 2)) * 3600 * 1000;

    let totalDelivered = 0;

    contract.asignaciones.forEach(assignment => {
        if (assignment.estado === 'COMPLETADO') return; // Or handle completed assignments differently? 
        // Assuming completed assignments have their legacy impact, but for "Live" simulation of current active ones:
        
        const truck = vehicles.find(v => v.id === assignment.camion_id);
        if (!truck) return; // Should not happen

        const capacity = (truck.remolque && truck.remolque.capacidad) ? truck.remolque.capacidad : 24000;
        const startTime = new Date(assignment.fecha_inicio).getTime();

        if (startTime > now) return; // Hasn't started yet

        const elapsed = now - startTime;

        if (elapsed >= firstDeliveryTimeMs) {
            // First trip done
            let trips = 1;
            
            // Remaining time for subsequent cycles
            const remainingTime = elapsed - firstDeliveryTimeMs;
            trips += Math.floor(remainingTime / cycleTimeMs);

            totalDelivered += trips * capacity;
        }
    });

    // Clamp to total quantity to avoid overflow
    return Math.min(contract.total_quantity, totalDelivered);
};
