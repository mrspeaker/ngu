async function main() {
    const world = {
        game: await load_random_test_game(),
        renderer: init_renderer(),
    };

    init_ui(world);
    run(world);
}
main();

function init_ui(world) {
    document.querySelector("#btn1").addEventListener("click", async () => {
        world.game = await load_random_test_game();
    });
}

async function load_random_test_game() {
    const path = "test_" + ((Math.random() * 2) | 0);
    return await load_game(path + ".json");
}

async function load_game(path) {
    return fetch(path)
        .then((r) => r.json())
        .then(runner);
}

function init_renderer() {
    const ctx = document.querySelector("#board").getContext("2d");
    return {
        ctx,
        render: (state) => {
            ctx.fillStyle = state.bgColor;
            ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            ctx.fillStyle = state.fgColor;
            ctx.fillText(state.title, 20, 20);
            ctx.fillText(state.tick, 100, 100);
        },
    };
}

function runner(proj) {
    const state = {
        title: proj.title,
        tick: 0,
        running: true,
        onTick: new Function(proj.test_script),
        bgColor: proj.bgColor || "#000",
        fgColor: proj.fgColor || "#fff",
    };

    return {
        state,
        tick: () => {
            if (!state.running) {
                return;
            }
            state.onTick();
            state.tick++;
        },
    };
}

function run(world) {
    world.game.tick();
    world.renderer.render(world.game.state);
    requestAnimationFrame(() => run(world));
}
