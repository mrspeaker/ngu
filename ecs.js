const mk_ecs = () => {
    let ent_id = 0;
    let comp_id = 0;

    const comps = [];
    const systems = [];

    const comps_ent = [];

    return {
        mk_ent: () => ent_id++,
        mk_comp: (name, state) => {
            comps.push({
                name,
                id: comp_id,
                ...state,
            });
            comp_id++;
            return comp_id++;
        },
        mk_system: (name, comps, f) => {
            systems.push({ name, comps, f });
        },
        add_comp: (ent, comp) => {
            comps_ent[comp.name] = comps_ent[comp.name] || [];
            comps_ent[comp.name].push({ comp, ent });
        },
        tick: () => {
            systems.forEach(({ name, comps, f }) => {
                // run system on matching comps
            });
        },
    };
};

/*
  Something like this:
const ecs = mk_ecs();
const comp = ecs.mk_comp("boop", { x: 1 });
const ent = ecs.mk_ent();
ecs.add_comp(ent, comp);

ecs.mk_system("move", ["boop"], ([b]) => {
    b.x += 1;
});

ecs.tick();
*/
