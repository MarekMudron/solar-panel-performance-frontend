<script>
    import Two from "two.js";

    let two;

    function start() {
        two = new Two({
            fullscreen: true,
            autostart: true,
        }).appendTo(document.getElementById("canv"));
        two.renderer.domElement.style.background = "rgba(253, 109, 109, 0.2)";
    }

    // Convert from degrees to radians.
    Math.radians = function (degrees) {
        return (degrees * Math.PI) / 180;
    };

    // Convert from radians to degrees.
    Math.degrees = function (radians) {
        return (radians * 180) / Math.PI;
    };

    let lines = [];

    let currentLine;
    let perpsLeft;
    let rect;
    let perpsRight;

    import { createEventDispatcher } from "svelte";

    const dispatch = createEventDispatcher();

    function rectDrawn() {
        dispatch("rectDrawn", rect);
    }

    export function activate(componentType) {
        canv.addEventListener("pointermove", lineMove);
        canv.addEventListener("pointerup", drawLine);
    }

    function getPosition(event) {
        var x =
            event.clientX -
            two.renderer.domElement.getBoundingClientRect().left;
        var y =
            event.clientY - two.renderer.domElement.getBoundingClientRect().top;
        return [x, y];
    }

    function lineMove(event) {
        if (currentLine) {
            let [x, y] = getPosition(event);
            currentLine.vertices[1].set(x, y);
            let [p1, p2] = currentLine.vertices;
            let [endl1, endl2] = getSecondPoints(p1, p2.clone().sub(p1));
            let [endr1, endr2] = getSecondPoints(p2, p2.clone().sub(p1));
            perpsLeft[0].vertices[1].set(endl1.x, endl1.y);
            perpsLeft[1].vertices[1].set(endl2.x, endl2.y);

            perpsRight[0].vertices[1].set(endr1.x, endr1.y);
            perpsRight[1].vertices[1].set(endr2.x, endr2.y);
            perpsRight[0].vertices[0].set(x, y);
            perpsRight[1].vertices[0].set(x, y);
        }
    }

    function getSecondPoints(origin, lineVec) {
        let norm1 = lineVec.clone();
        let x = norm1.x;
        norm1.x = norm1.y;
        norm1.y = x;
        let norm2 = norm1.clone();
        norm2.y = -norm2.y;
        norm1.x = -norm1.x;
        let end1 = origin.clone().add(norm1);
        let end2 = origin.clone().add(norm2);
        return [end1, end2];
    }

    function createPerpendiculars(origin, lineVec) {
        let [end1, end2] = getSecondPoints(origin, lineVec);
        let l1 = two.makeLine(origin.x, origin.y, end1.x, end1.y);
        let l2 = two.makeLine(origin.x, origin.y, end2.x, end2.y);
        l1.stroke = "white";
        l2.stroke = "white";
        return [l1, l2];
    }

    function removePerpsIfExist() {
        if (perpsLeft) {
            perpsLeft[0].remove();
            perpsLeft[1].remove();
        }

        if (perpsRight) {
            perpsRight[0].remove();
            perpsRight[1].remove();
        }

        perpsLeft = null;
        perpsRight = null;
    }

    function pointLineDistance(line, point) {
        let [p1, p2] = line.vertices;
        let lineVec = p2.clone().sub(p1);
        let pointVec = point.clone().sub(p1);
        let dot = lineVec.clone().dot(pointVec);
        let ls = lineVec.lengthSquared();
        let t = dot / ls;
        let p = p1.clone().add(lineVec.multiplyScalar(t));
        return Two.Vector.distanceBetween(p, point);
    }

    function normalizeAngle(angle) {
        while (angle < -Math.PI) {
            angle += 2 * Math.PI;
        }
        while (angle >= Math.PI) {
            angle -= 2 * Math.PI;
        }
        return angle;
    }

    function rectMove(event) {
        if (!rect) return;
        var angle;
        let [v1, v2] = currentLine.vertices;
        if (v2.x !== v1.x) {
            angle = Math.atan2(v2.y - v1.y, v2.x - v1.x);
        } else {
            // For vertical lines, set the angle to 90 degrees (in radians)
            angle = Math.PI / 2;
        }

        let [x, y] = getPosition(event);
        var height = pointLineDistance(currentLine, new Two.Vector(x, y));

        let [p1, p2] = currentLine.vertices;

        let aa = p2.clone().sub(p1);
        let a = new Two.Vector(aa.x, aa.y);
        let b = new Two.Vector(x, y).sub(p1);
        let angleBetween = normalizeAngle(
            Math.atan2(b.y, b.x) - Math.atan2(a.y, a.x),
        );
        if (angleBetween > 0) {
            rect.origin.y = -height / 2;
        } else {
            rect.origin.y = height / 2;
        }

        rect.height = height;
    }

    function drawRect(event) {
        var angle;
        let [v1, v2] = currentLine.vertices;
        if (v2.x !== v1.x) {
            angle = Math.atan2(v2.y - v1.y, v2.x - v1.x);
        } else {
            // For vertical lines, set the angle to 90 degrees (in radians)
            angle = Math.PI / 2;
        }
        var centerX = (v1.x + v2.x) / 2;
        var centerY = (v1.y + v2.y) / 2;

        var width = currentLine.length; // Example, adjust as needed
        let [x, y] = getPosition(event);
        var height = pointLineDistance(currentLine, new Two.Vector(x, y));
        let [p1, p2] = currentLine.vertices;

        let aa = p2.clone().sub(p1);
        let a = new Two.Vector(aa.x, aa.y);
        let b = new Two.Vector(x, y).sub(p1);
        let angleBetween = Math.atan2(b.y, b.x) - Math.atan2(a.y, a.x);
        //centerY += Math.cos(angle)*height/2;
        if (angleBetween > 0) {
            centerX -= (Math.sin(angle) * height) / 2;
            centerY += (Math.cos(angle) * height) / 2;
        } else {
            centerX += (Math.sin(angle) * height) / 2;
            centerY -= (Math.cos(angle) * height) / 2;
        }

        // Create the rectangle
        rect = two.makeRectangle(centerX, centerY, width, height);

        // Rotate the rectangle to match the line's angle
        rect.rotation = angle;

        // Set the rectangle's appearance
        rect.stroke = "#007cdb";
        rect.fill = "rgba(0, 124, 219,0.2)";
        rect.linewidth = 2;
    }

    function finishRect(event) {
        canv.removeEventListener("pointerup", finishRect);
        canv.removeEventListener("pointermove", rectMove);
        canv.addEventListener("pointermove", lineMove);
        canv.addEventListener("pointerup", drawLine);
        rectDrawn();
        currentLine = null;
    }

    let canv;

    function drawLine(event) {
        if (currentLine) {
            removePerpsIfExist();
            drawRect(event);
            canv.removeEventListener("pointerup", drawLine);
            canv.removeEventListener("pointermove", lineMove);
            canv.addEventListener("pointermove", rectMove);
            canv.addEventListener("pointerup", finishRect);
        } else {
            let [x, y] = getPosition(event);
            let newLine = two.makeLine(x, y, x, y);
            newLine.stroke = "white";
            lines.concat(currentLine);
            currentLine = newLine;
            let [p1, p2] = currentLine.vertices;
            perpsLeft = createPerpendiculars(p1, p2.clone().sub(p1));
            perpsRight = createPerpendiculars(p1, p2.clone().sub(p1));
        }
    }
    export const COMPONENTS = {
        Sedlova: "Sedlova",
        Valbova: "Valbova",
        Ihlanova: "Ihlanova",
        Pultova: "Pultova",
    };

    let currentLabel;

    function activateDrawing(label) {
        currentLabel = label;
        activate(currentLabel);
    }

    export let active;
</script>

<div style="display:{active ? 'block' : "none"}">
    <div
        style="height:100vh; width:100vw; z-index:200;background-color:rgba(200,2,12, 0.4)"
        id="canv"
        bind:this={canv}
        use:start
    ></div>

    <div
        class="vstack position-absolute top-50 start-0 translate-middle-y border"
    >
        <button
            type="button"
            class="btn btn-primary btn-block mb-2"
            on:click={() => activateDrawing(COMPONENTS.Sedlova)}>Sedlova</button
        >
        <button
            type="button"
            class="btn btn-primary btn-block mb-2"
            on:click={() => activateDrawing(COMPONENTS.Ihlanova)}
            >Ihlanova</button
        >
        <button
            type="button"
            class="btn btn-primary btn-block mb-2"
            on:click={() => activateDrawing(COMPONENTS.Valbova)}>Valbova</button
        >
        <button
            type="button"
            class="btn btn-primary btn-block mb-2"
            on:click={() => activateDrawing(COMPONENTS.Pultova)}>Pultova</button
        >
    </div>
</div>
