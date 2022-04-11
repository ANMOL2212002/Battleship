class landscape{
    constructor(scene, renderer){
        this.waterObj;
        this.skyObj;
        this.sunObj;
        this.pmremGenerator
        this.initRenderData(scene, renderer);
    }
    
    initRenderData(scene, renderer){
       // Water
        const waterGeometry = new THREE.PlaneGeometry(10000, 10000);

        this.waterObj = new THREE.Water(
            waterGeometry,
            {
                textureWidth: 512,
                textureHeight: 512,
                waterNormals: new THREE.TextureLoader().load('/models/waternormals.jpg', function ( texture ) {

                    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

                } ),
                sunDirection: new THREE.Vector3(),
                sunColor: 0xffffff,
                waterColor: 0x001e0f,
                distortionScale: 3.7,
                fog: scene.fog !== undefined
            }
        );

        this.waterObj.position.y -= 4;
        this.waterObj.rotation.x = - Math.PI / 2;

        scene.add(this.waterObj);

        // Skybox
        this.skyObj = new THREE.Sky();
        this.skyObj.scale.setScalar(10000);
        scene.add(this.skyObj);

        const skyUniforms = this.skyObj.material.uniforms;

        skyUniforms['turbidity'].value = 10;
        skyUniforms['rayleigh'].value = 2;
        skyUniforms['mieCoefficient'].value = 0.005;
        skyUniforms['mieDirectionalG'].value = 0.8;

        // sun
        this.sunObj = new THREE.Vector3();
        this.pmremGenerator = new THREE.PMREMGenerator(renderer);
    }
    
    updateSun(scene) {
        const parameters = {
            inclination: 0.49,
            //elevation: 2,
            azimuth: 0.205
        };

        const theta = Math.PI * (parameters.inclination - 0.5);
        const phi = 2 * Math.PI * (parameters.azimuth - 0.5);

        this.sunObj.x = Math.cos(phi);
        this.sunObj.y = Math.sin(phi) * Math.sin(theta);
        this.sunObj.z = Math.sin(phi) * Math.cos(theta);

        this.skyObj.material.uniforms['sunPosition'].value.copy(this.sunObj);
        this.waterObj.material.uniforms['sunDirection'].value.copy(this.sunObj).normalize();
        scene.environment = this.pmremGenerator.fromScene(this.skyObj).texture;
    }
}