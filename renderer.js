export function mk_renderer() {
    const ctx = document.querySelector("#board").getContext("2d");
    return {
        ctx,
        render: (state) => {
            ctx.fillStyle = state.bgColor;
            ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            ctx.fillStyle = state.fgColor;
            ctx.fillText(state.title, 20, 20);
            ctx.fillText(state.tick, 100, 100);

            ctx.fillStyle = "#f0f";
            state.ecs.get_comps("pos").forEach((e) => {
                ctx.fillRect(e.x, e.y, e.w, e.h);
            });
        },
    };
}
