const test0 = {
    title: "terrifying cantilopes won't ever stop",
    test_script: "console.log('hi');",
    bgColor: "#000",
    fgColor: "#fff",
    ents: [
        [
            {
                name: "pos",
                state: { x: 10, y: 130, w: 5, h: 5 },
            },
            {
                name: "bob",
                state: {
                    t: 0,
                    amp: 0.5,
                    fq: 0.1,
                },
            },
            {
                name: "move",
                state: {
                    xo: 0.5,
                    yo: -0.2,
                },
            },
        ],
        [
            {
                name: "pos",
                state: {
                    x: 10,
                    y: 130,
                    w: 5,
                    h: 5,
                },
            },
            {
                name: "spawner",
                state: { t: 0 },
            },
        ],
    ],
    systems: [
        {
            name: "move_sys",
            comps: ["pos", "move"],
            args: ["ecs", "p", "m"],
            body: "p.x += m.xo;\np.y += m.yo;",
        },
        {
            name: "bob_sys",
            comps: ["pos", "bob"],
            args: ["ecs", "p", "b"],
            body: "b.t += b.fq;\np.y += Math.sin(b.t) * b.amp;",
        },
        {
            name: "spawn_sys",
            comps: ["spawner", "pos"],
            args: ["ecs", "s", "p"],
            body: `
s.t+=1;
if(s.t < 250) {
  return;
};
s.t = 0;
ecs.boop();`,
        },
    ],
};

console.log(JSON.stringify(test0));
