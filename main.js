import { mk_runner_from_path } from "./runner.js";
import { mk_renderer } from "./renderer.js";
import { $, $click } from "./eq.js";

async function main() {
    const world = {
        game: await load_random_test_game(),
        renderer: mk_renderer(),
    };

    init_ui(world);
    run(world);
}
main();

function init_ui(world) {
    $click("#btn1", async () => {
        world.game = await load_random_test_game();
    });
}

async function load_random_test_game() {
    const path = "data/test_" + ((Math.random() * 2) | 0);
    return await mk_runner_from_path(path + ".json");
}

function run(world) {
    world.game.tick();
    world.renderer.render(world.game.state);
    requestAnimationFrame(() => run(world));
}
