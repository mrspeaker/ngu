// import "./data/test_0.js";
import { $, $click } from "./eq.js";
import { mk_runner_from_path } from "./runner.js";
import { mk_renderer } from "./renderer.js";
import { mk_ecs } from "./ecs.js";

async function main() {
    const game = await load_random_test_game();
    const renderer = mk_renderer(game.state);

    const world = {
        game,
        renderer,
    };

    init_ui(world);
    run(world);
}
main();

function init_ui(world) {
    $click("#btnLoad", async () => {
        world.game = await load_random_test_game();
        world.renderer.reset(world.game.state);
        $("#proj").innerText = JSON.stringify(world.game.state.proj, null, 2);
    });
    $click("#btnPause", async () => {
        world.game.state.running = !world.game.state.running;
    });
}

async function load_random_test_game() {
    const path = "data/test_" + ((Math.random() * 2) | 0) + ".json";
    return await mk_runner_from_path(path);
}

function run(world) {
    world.game.tick();
    world.renderer.render(world.game.state);
    requestAnimationFrame(() => run(world));
}
