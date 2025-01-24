import { mk_ecs } from "./ecs.js";

export function mk_runner(proj) {
    const ecs = mk_ecs();
    const state = {
        title: proj.title,
        tick: 0,
        running: true,
        ecs,
        onTick: () => {}, //new Function(proj.test_script),
        bgColor: proj.bgColor || "#000",
        fgColor: proj.fgColor || "#fff",
    };

    proj.ents.forEach((ent_def) => {
        const ent = ecs.mk_ent();
        ent_def.forEach(({ name, state }) => {
            const comp = ecs.mk_comp(name, state);
            ecs.add_comp(ent, comp);
        });
    });

    ecs.mk_system("move_sys", ["pos", "move"], (p, m) => {
        p.x += m.xo;
        p.y += m.yo;
    });

    return {
        state,
        tick: () => {
            if (!state.running) {
                return;
            }
            state.onTick();
            state.tick++;
            state.ecs.tick();
        },
    };
}

export function mk_runner_from_path(path) {
    return fetch(path)
        .then((r) => r.json())
        .then(mk_runner);
}
