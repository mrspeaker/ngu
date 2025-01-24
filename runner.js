export function mk_runner(proj) {
    const state = {
        title: proj.title,
        tick: 0,
        running: true,
        onTick: new Function(proj.test_script),
        bgColor: proj.bgColor || "#000",
        fgColor: proj.fgColor || "#fff",
        ents: [],
    };

    Object.entries(proj.ents).forEach(([k, v]) => {
        state.ents.push({
            x: v.x,
            y: v.y,
            w: v.w,
            h: v.h,
        });
    });

    return {
        state,
        tick: () => {
            if (!state.running) {
                return;
            }
            state.onTick();
            state.tick++;
            state.ents.forEach((e) => {
                e.x += 1;
                if (e.x > 300) {
                    e.x = 0;
                }
            });
        },
    };
}

export function mk_runner_from_path(path) {
    return fetch(path)
        .then((r) => r.json())
        .then(mk_runner);
}
