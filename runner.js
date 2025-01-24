import { mk_ecs } from "./ecs.js";

export function mk_runner(proj, path) {
    const w = proj.w || 320;
    const h = proj.h || 200;

    const ecs = mk_ecs(w, h);
    const state = {
        title: proj.title,
        tick: 0,
        running: true,
        ecs,
        onTick: () => {}, //new Function(proj.test_script),
        bgColor: proj.bgColor || "#000",
        fgColor: proj.fgColor || "#fff",
        w,
        h,
        path,
        proj,
    };

    proj.ents.forEach((ent_def) => {
        const ent = ecs.mk_ent();
        ent_def.forEach(({ name, state }) => {
            const comp = ecs.mk_comp(name, state);
            ecs.add_comp(ent, comp);
        });
    });

    proj.systems.forEach(({ name, comps, args, body }) => {
        ecs.mk_system(name, comps, new Function(...args, body));
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
        .then((j) => mk_runner(j, path));
}
