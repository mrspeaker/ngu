export const mk_ecs = () => {
    let ent_id = 0;
    let comp_id = 0;

    const comps = [];
    const systems = [];

    const comps_ent = [];
    const ents_comp = [];

    return {
        get_comps: (name) => comps.filter((c) => c.name == name),
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
            const comps = [...comp_names.map(() => ({}))];
            systems.push({ name, comp_names, comps, f });
        },
        add_comp: (ent, comp) => {
            comps_ent[comp.name] = comps_ent[comp.name] || [];
            comps_ent[comp.name].push({ comp, ent });
            console.log("Add", ent, comp, ":::", comps_ent[comp.name]);

            ents_comp[ent] = ents_comp[ent] || {};
            ents_comp[ent][comp.name] = comp;
        },
        tick: () => {
            systems.forEach(({ name, comp_names, comps, f }) => {
                // TODO: cache until add/remove comps
                const initial_ents = comps_ent[comp_names[0]].map(
                    ({ ent }) => ent,
                );
                const matching_ents = comp_names.slice(1).reduce((ac, el) => {
                    if (ac.length == 0 || !comps_ent[el]) {
                        return [];
                    }
                    const comp_ents = comps_ent[el].map(({ ent }) => ent);
                    return ac.filter((e) => comp_ents.includes(e));
                }, initial_ents);
                const comps_by_ent = matching_ents.map((e) => ents_comp[e]);
                comps_by_ent.forEach((cs) => {
                    f(...Object.values(cs));
                });
            });
        },
    };
};

/*
const ecs = mk_ecs();
const e1 = ecs.mk_ent();
const c1 = ecs.mk_comp("boop", { x: 1 });
const c1b = ecs.mk_comp("beep", { b: true });
ecs.add_comp(e1, c1);
ecs.add_comp(e1, c1b);

const e2 = ecs.mk_ent();
const c2 = ecs.mk_comp("boop", { x: 10 });
const c2b = ecs.mk_comp("beep", { b: true });
ecs.add_comp(e2, c2);
ecs.add_comp(e2, c2b);

ecs.mk_system("move", ["boop"], (b) => {
    b.x += 1;
});
ecs.mk_system("beeper", ["boop", "beep"], (boop, beep) => {
    if (boop.x <= 10) {
        console.log("beeeep", beep.b);
    } else {
        console.log("no beep", beep.b);
    }
});

ecs.tick();
*/
