<script>
    import { onMount } from "svelte";

    onMount(() => {
        const geometry = new PlaneGeometry(dimMeters, dimMeters);
        let mapPlane = new Mesh(geometry, new MeshBasicMaterial({ visible: true, color:0xff0000 }));
        //let texture = new TextureLoader().load(img.src);
        //texture.colorSpace = SRGBColorSpace;
        //mapPlane.material.map = texture;
        mapPlane.material.depthTest = false;
        scene.add(mapPlane);
    });
</script>