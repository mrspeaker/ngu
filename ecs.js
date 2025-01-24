const mk_ecs = () => {
    let ent_id = 0;
    let comp_id = 0;

    const comps = [];
    const systems = [];

    const comps_ent = [];
    const ents_comp = [];

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
        mk_system: (name, comp_names, f) => {
            const comps = [...comp_names.map(() => ({}))];
            systems.push({ name, comp_names, comps, f });
        },
        add_comp: (ent, comp) => {
            comps_ent[comp.name] = comps_ent[comp.name] || [];
            comps_ent[comp.name].push({ comp, ent });

            ents_comp[ent] = ents_comp[ent] || {};
            ents_comp[comp.name] = comp;
        },
        tick: () => {
            systems.forEach(({ name, comp_names, comps, f }) => {
                const initial_ents = comps_ent[comp_names[0]].map(
                    ({ ent }) => ent,
                );
                const matching_ents = comp_names.slice(1).reduce((ac, el) => {
                    const comp_ents = comps_ent[el].map(({ ent }) => ent);
                    return ac.filter((e) => comp_ents.includes(e));
                }, initial_ents);

                const comps_by_ent = matching_ents.map((e) => ents_comp[e]);
                comps_by_ent.forEach((cs) => {
                    f(...cs);
                });
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
