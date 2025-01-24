export const mk_ecs = (w, h) => {
    let ent_id = 0;
    let comp_id = 0;

    const comps = [];
    const systems = [];

    const comps_ent = [];
    const ents_comp = [];

    return {
        world: {
            w,
            h,
        },
        get_comps: (name) => comps.filter((c) => c.name == name),
        spawn_test: function (x, y) {
            const ecs = this;
            const e = ecs.mk_ent();
            const m = ecs.mk_comp("move", {
                xo: Math.random() - 0.5,
                yo: Math.random() - 0.5,
            });
            const p = ecs.mk_comp("pos", { x, y, w: 5, h: 5 });
            ecs.add_comp(e, p);
            ecs.add_comp(e, m);
        },
        mk_ent: () => ent_id++,
        mk_comp: (name, state) => {
            const comp = {
                name,
                id: comp_id,
                ...state,
            };
            comps.push(comp);
            comp_id++;
            return comp;
        },
        mk_system: (name, comp_names, f) => {
            systems.push({ name, comp_names, f });
        },
        add_comp: (ent, comp) => {
            // Making two lookups: one from comp_name to list of ent ids,
            // and one from ent id to OBJECT of comps by comp_name
            comps_ent[comp.name] = comps_ent[comp.name] || [];
            comps_ent[comp.name].push({ comp, ent });
            ents_comp[ent] = ents_comp[ent] || {};
            ents_comp[ent][comp.name] = comp;
        },
        tick: function () {
            systems.forEach(({ name, comp_names, f }) => {
                // TODO: cache until add/remove comps
                const first_comp_name = comp_names[0];
                const initial_ents = (comps_ent[first_comp_name] || []).map(
                    ({ ent }) => ent,
                );
                const matching_ents = comp_names.slice(1).reduce((ac, el) => {
                    if (ac.length == 0 || !comps_ent[el]) {
                        return [];
                    }
                    const comp_ents = comps_ent[el].map(({ ent }) => ent);
                    return ac.filter((e) => comp_ents.includes(e));
                }, initial_ents);
                const comps_by_ent = matching_ents.map((e) => {
                    // Get the ent's comps for each comp name
                    return comp_names.map((cn) => ents_comp[e][cn]);
                });

                // Run the system against each entity
                comps_by_ent.forEach((cs) => {
                    f(this, ...Object.values(cs));
                });
            });
        },
    };
};
