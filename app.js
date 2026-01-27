// Core variables
let scene, camera, renderer, controls;
let pointLight1, pointLight2, pointLight3;
let keyLight, fillLight, ambientLight;
let animationId;
let hdriEnabled = false;
let hdriTexture = null;
let pmremGenerator;
let nightMode = true;
let currentModel = null;
let crystalMaterial = null;
let rotateLights = true;
let guiVisible = false;
let crystalMeshes = [];
let isHDRIChanging = false;
let modelPointLights = [];

// HDRI variables (removed rotation)
let currentHDRIExposure = 1.0;
let currentToneMapping = THREE.ACESFilmicToneMapping;

// Model lighting controls
let modelLightsEnabled = false;
let modelLightsIntensity = 1.0;
let modelLightsColor = '#ffffff';

// Default file paths
const DEFAULT_MODEL_PATH = 'models/crystal-chandelier-lamp.glb';
const DEFAULT_HDRI_PATH = 'hdri/neutral.hdr';

// Tone mapping presets
const toneMappingPresets = {
    'ACESFilmic': THREE.ACESFilmicToneMapping,
    'Reinhard': THREE.ReinhardToneMapping,
    'Cineon': THREE.CineonToneMapping,
    'Linear': THREE.LinearToneMapping,
    'None': THREE.NoToneMapping
};

// Extended preset definitions with new parameters
const presets = {
    realistic: {
        color: '#ffffff',
        opacity: 1.0,
        ior: 2.0,
        roughness: 0.02,
        transmission: 0.95,
        thickness: 1.0,
        clearcoat: 1.0,
        clearcoatRoughness: 0.01,
        sheen: 0.0,
        sheenRoughness: 0.1,
        sheenColor: '#ffffff',
        specularIntensity: 0.8,
        specularColor: '#ffffff',
        attenuationColor: '#ffffff',
        attenuationDistance: 0.0,
        anisotropy: 0.0,
        anisotropyRotation: 0.0,
        dispersion: 0.0,
        envMapIntensity: 1.2,
        emissiveIntensity: 0.0,
        emissiveColor: '#000000'
    },
    diamond: {
        color: '#ffffff',
        opacity: 1.0,
        ior: 2.42,
        roughness: 0.01,
        transmission: 0.98,
        thickness: 1.0,
        clearcoat: 1.0,
        clearcoatRoughness: 0.0,
        sheen: 0.0,
        sheenRoughness: 0.0,
        sheenColor: '#ffffff',
        specularIntensity: 1.0,
        specularColor: '#ffffff',
        attenuationColor: '#ffffff',
        attenuationDistance: 0.0,
        anisotropy: 0.2,
        anisotropyRotation: 0.0,
        dispersion: 0.05,
        envMapIntensity: 1.5,
        emissiveIntensity: 0.0,
        emissiveColor: '#000000'
    },
    sapphire: {
        color: '#0066cc',
        opacity: 1.0,
        ior: 1.77,
        roughness: 0.01,
        transmission: 0.92,
        thickness: 0.8,
        clearcoat: 0.8,
        clearcoatRoughness: 0.02,
        sheen: 0.1,
        sheenRoughness: 0.15,
        sheenColor: '#0088ff',
        specularIntensity: 0.9,
        specularColor: '#0088ff',
        attenuationColor: '#004488',
        attenuationDistance: 0.5,
        anisotropy: 0.1,
        anisotropyRotation: 0.3,
        dispersion: 0.02,
        envMapIntensity: 1.3,
        emissiveIntensity: 0.0,
        emissiveColor: '#000000'
    },
    emerald: {
        color: '#00cc88',
        opacity: 1.0,
        ior: 1.58,
        roughness: 0.02,
        transmission: 0.90,
        thickness: 0.8,
        clearcoat: 0.7,
        clearcoatRoughness: 0.03,
        sheen: 0.15,
        sheenRoughness: 0.2,
        sheenColor: '#00ffaa',
        specularIntensity: 0.8,
        specularColor: '#00ffaa',
        attenuationColor: '#006644',
        attenuationDistance: 0.6,
        anisotropy: 0.0,
        anisotropyRotation: 0.0,
        dispersion: 0.01,
        envMapIntensity: 1.2,
        emissiveIntensity: 0.0,
        emissiveColor: '#000000'
    },
    glass: {
        color: '#ffffff',
        opacity: 1.0,
        ior: 1.5,
        roughness: 0.0,
        transmission: 0.97,
        thickness: 0.5,
        clearcoat: 0.0,
        clearcoatRoughness: 0.0,
        sheen: 0.0,
        sheenRoughness: 0.0,
        sheenColor: '#ffffff',
        specularIntensity: 0.5,
        specularColor: '#ffffff',
        attenuationColor: '#ffffff',
        attenuationDistance: 0.0,
        anisotropy: 0.0,
        anisotropyRotation: 0.0,
        dispersion: 0.0,
        envMapIntensity: 1.0,
        emissiveIntensity: 0.0,
        emissiveColor: '#000000'
    },
    quartz: {
        color: '#ffffff',
        opacity: 1.0,
        ior: 1.54,
        roughness: 0.01,
        transmission: 0.94,
        thickness: 0.7,
        clearcoat: 0.5,
        clearcoatRoughness: 0.05,
        sheen: 0.05,
        sheenRoughness: 0.25,
        sheenColor: '#ffffff',
        specularIntensity: 0.7,
        specularColor: '#ffffff',
        attenuationColor: '#ffffff',
        attenuationDistance: 0.3,
        anisotropy: 0.0,
        anisotropyRotation: 0.0,
        dispersion: 0.0,
        envMapIntensity: 1.1,
        emissiveIntensity: 0.0,
        emissiveColor: '#000000'
    },
    ruby: {
        color: '#ff3366',
        opacity: 1.0,
        ior: 1.76,
        roughness: 0.01,
        transmission: 0.88,
        thickness: 0.9,
        clearcoat: 0.9,
        clearcoatRoughness: 0.01,
        sheen: 0.2,
        sheenRoughness: 0.1,
        sheenColor: '#ff6688',
        specularIntensity: 1.0,
        specularColor: '#ff6688',
        attenuationColor: '#990033',
        attenuationDistance: 0.7,
        anisotropy: 0.15,
        anisotropyRotation: 0.5,
        dispersion: 0.03,
        envMapIntensity: 1.4,
        emissiveIntensity: 0.0,
        emissiveColor: '#000000'
    },
    ice: {
        color: '#e6f7ff',
        opacity: 0.98,
        ior: 1.31,
        roughness: 0.15,
        transmission: 0.85,
        thickness: 0.4,
        clearcoat: 0.3,
        clearcoatRoughness: 0.1,
        sheen: 0.3,
        sheenRoughness: 0.4,
        sheenColor: '#b3e5ff',
        specularIntensity: 0.6,
        specularColor: '#b3e5ff',
        attenuationColor: '#99d6ff',
        attenuationDistance: 0.8,
        anisotropy: 0.0,
        anisotropyRotation: 0.0,
        dispersion: 0.01,
        envMapIntensity: 1.0,
        emissiveIntensity: 0.1,
        emissiveColor: '#b3e5ff'
    },
    chandelier: {
        color: '#ffffff',
        opacity: 1.0,
        ior: 1.7,
        roughness: 0.01,
        transmission: 0.96,
        thickness: 0.6,
        clearcoat: 1.0,
        clearcoatRoughness: 0.01,
        sheen: 0.1,
        sheenRoughness: 0.15,
        sheenColor: '#ffffff',
        specularIntensity: 0.8,
        specularColor: '#ffffff',
        attenuationColor: '#ffffff',
        attenuationDistance: 0.0,
        anisotropy: 0.05,
        anisotropyRotation: 0.0,
        dispersion: 0.02,
        envMapIntensity: 1.2,
        emissiveIntensity: 0.0,
        emissiveColor: '#000000'
    },
    // New experimental presets
    holographic: {
        color: '#ffffff',
        opacity: 0.95,
        ior: 2.1,
        roughness: 0.05,
        transmission: 0.8,
        thickness: 0.3,
        clearcoat: 0.8,
        clearcoatRoughness: 0.02,
        sheen: 0.5,
        sheenRoughness: 0.1,
        sheenColor: '#ff00ff',
        specularIntensity: 1.0,
        specularColor: '#ff00ff',
        attenuationColor: '#ff00ff',
        attenuationDistance: 1.0,
        anisotropy: 0.3,
        anisotropyRotation: 0.8,
        dispersion: 0.1,
        envMapIntensity: 2.0,
        emissiveIntensity: 0.3,
        emissiveColor: '#ff00ff'
    },
    iridescent: {
        color: '#ffffff',
        opacity: 0.9,
        ior: 1.8,
        roughness: 0.02,
        transmission: 0.7,
        thickness: 0.4,
        clearcoat: 0.6,
        clearcoatRoughness: 0.01,
        sheen: 0.8,
        sheenRoughness: 0.05,
        sheenColor: '#00ffff',
        specularIntensity: 0.9,
        specularColor: '#00ffff',
        attenuationColor: '#00ffff',
        attenuationDistance: 0.5,
        anisotropy: 0.4,
        anisotropyRotation: 0.6,
        dispersion: 0.08,
        envMapIntensity: 1.8,
        emissiveIntensity: 0.2,
        emissiveColor: '#00ffff'
    },
    glow: {
        color: '#ffffff',
        opacity: 0.8,
        ior: 1.6,
        roughness: 0.1,
        transmission: 0.6,
        thickness: 0.5,
        clearcoat: 0.4,
        clearcoatRoughness: 0.15,
        sheen: 0.2,
        sheenRoughness: 0.3,
        sheenColor: '#ffff00',
        specularIntensity: 0.7,
        specularColor: '#ffff00',
        attenuationColor: '#ffff00',
        attenuationDistance: 0.9,
        anisotropy: 0.1,
        anisotropyRotation: 0.2,
        dispersion: 0.04,
        envMapIntensity: 1.5,
        emissiveIntensity: 0.8,
        emissiveColor: '#ffff00'
    }
};

// Initialize the application
function init() {
    const container = document.getElementById('canvas-container');

    // Create scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a0a);
    scene.fog = new THREE.Fog(0x0a0a0a, 10, 50);

    // Create camera
    camera = new THREE.PerspectiveCamera(
        45,
        container.clientWidth / container.clientHeight,
        0.1,
        1000
    );
    camera.position.set(0, 2, 5);

    // Create renderer
    renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance'
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = currentHDRIExposure;
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // PMREM Generator for HDRI
    pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();

    // Create default crystal material with extended parameters
    createCrystalMaterial();

    // Setup lighting
    setupLighting();

    // Create ground plane
    const groundGeometry = new THREE.PlaneGeometry(50, 50);
    const groundMaterial = new THREE.MeshStandardMaterial({
        color: 0x111111,
        roughness: 0.8,
        metalness: 0.2
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -1;
    ground.receiveShadow = true;
    scene.add(ground);

    // Setup orbit controls
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 2;
    controls.maxDistance = 20;
    controls.maxPolarAngle = Math.PI / 2 - 0.1;

    // Handle window resize
    window.addEventListener('resize', onWindowResize);

    // Start animation loop
    animate();

    // Try to load default model, show fallback if it fails
    setTimeout(() => {
        tryLoadDefaultModel();
    }, 1000);

    // Show GUI by default
    toggleGUI();
}

function createCrystalMaterial() {
    crystalMaterial = new THREE.MeshPhysicalMaterial({
        // Basic properties
        color: 0xffffff,
        metalness: 0.0,
        roughness: 0.01,
        ior: 1.7,
        transmission: 0.96,
        thickness: 0.6,
        transparent: true,
        opacity: 1.0,
        side: THREE.DoubleSide,
        
        // Clearcoat properties
        clearcoat: 1.0,
        clearcoatRoughness: 0.01,
        
        // Sheen properties
        sheen: 0.0,
        sheenRoughness: 0.1,
        sheenColor: 0xffffff,
        
        // Specular properties
        specularIntensity: 0.8,
        specularColor: 0xffffff,
        
        // Transmission/attenuation properties
        attenuationColor: 0xffffff,
        attenuationDistance: 0.0,
        
        // Anisotropy properties
        anisotropy: 0.0,
        anisotropyRotation: 0.0,
        
        // Environment map intensity
        envMapIntensity: 1.2,
        
        // Emissive properties
        emissive: 0x000000,
        emissiveIntensity: 0.0
    });
}

function setupLighting() {
    // Ambient light
    ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    // Key light (main directional)
    keyLight = new THREE.DirectionalLight(0xffffff, 2.5);
    keyLight.position.set(5, 10, 5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 2048;
    keyLight.shadow.mapSize.height = 2048;
    keyLight.shadow.camera.near = 0.1;
    keyLight.shadow.camera.far = 50;
    scene.add(keyLight);

    // Fill light
    fillLight = new THREE.DirectionalLight(0xaaccff, 1.2);
    fillLight.position.set(-8, 5, 3);
    scene.add(fillLight);

    // Point lights
    pointLight1 = new THREE.PointLight(0x88ccff, 1.5, 20);
    pointLight1.position.set(6, 4, 6);
    pointLight1.decay = 2;
    scene.add(pointLight1);

    pointLight2 = new THREE.PointLight(0xff88cc, 1.5, 20);
    pointLight2.position.set(-6, 4, -6);
    pointLight2.decay = 2;
    scene.add(pointLight2);

    pointLight3 = new THREE.PointLight(0x88ff88, 1.0, 15);
    pointLight3.position.set(0, 3, 8);
    pointLight3.decay = 2;
    scene.add(pointLight3);
}

function animate() {
    animationId = requestAnimationFrame(animate);

    // Rotate point lights if enabled
    if (rotateLights) {
        const time = Date.now() * 0.001;
        pointLight1.position.x = Math.cos(time) * 3;
        pointLight1.position.z = Math.sin(time) * 3;
        pointLight2.position.x = Math.cos(time + Math.PI) * 3;
        pointLight2.position.z = Math.sin(time + Math.PI) * 3;
        pointLight3.position.y = 3 + Math.sin(time * 1.5) * 0.5;
    }

    controls.update();
    renderer.render(scene, camera);
}

function onWindowResize() {
    const container = document.getElementById('canvas-container');
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
}

function tryLoadDefaultModel() {
    const loadingEl = document.getElementById('loading');
    const demoCubeEl = document.getElementById('demo-cube');

    if (window.location.protocol === 'file:') {
        console.log('Running from file:// protocol - cannot load external files due to CORS');
        loadingEl.style.display = 'none';
        demoCubeEl.style.display = 'flex';
        document.getElementById('model-status').textContent = 'File protocol - upload needed';
        document.getElementById('crystal-status').textContent = '0 found';
        document.getElementById('hdri-status').textContent = 'Disabled';
        showMessage('Running from file:// - Please upload a model or run a local server', 'warning');
        return;
    }

    loadModelFromPath(DEFAULT_MODEL_PATH, function () {
        loadingEl.style.display = 'none';
        demoCubeEl.style.display = 'none';

        setTimeout(() => {
            loadHDRIFromPath(DEFAULT_HDRI_PATH, function () {
                showMessage('Default model and HDRI loaded successfully!', 'success');
            }, function () {
                console.log('HDRI not loaded, using default lighting');
            });
        }, 500);
    }, function (error) {
        console.log('Default model not found, showing fallback');
        loadingEl.style.display = 'none';
        demoCubeEl.style.display = 'flex';
        document.getElementById('model-status').textContent = 'No model loaded';
        document.getElementById('crystal-status').textContent = '0 found';
        document.getElementById('hdri-status').textContent = 'Disabled';
        showMessage('Default model not found. Please upload your own model.', 'info');
    });
}

function loadModelFromPath(path, onSuccess, onError) {
    const loader = new THREE.GLTFLoader();

    try {
        const dracoLoader = new THREE.DRACOLoader();
        dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/');
        dracoLoader.setDecoderConfig({ type: 'js' });
        loader.setDRACOLoader(dracoLoader);
    } catch (err) {
        console.warn('Draco loader setup failed, continuing without it');
    }

    loader.load(
        path,
        function (gltf) {
            // Remove previous model
            if (currentModel) {
                scene.remove(currentModel);
                crystalMeshes = [];
                removeModelLights();
            }

            const model = gltf.scene;
            model.name = 'uploadedModel';
            currentModel = model;

            let crystalCount = 0;

            // Apply crystal material to meshes named "Crystal"
            model.traverse(function (child) {
                if (child.isMesh) {
                    const meshName = child.name.toLowerCase();
                    if (meshName.includes('crystal')) {
                        crystalCount++;

                        if (Array.isArray(child.material)) {
                            if (child.material.length > 1) {
                                child.material[1] = crystalMaterial.clone();
                                crystalMeshes.push({
                                    mesh: child,
                                    primitiveIndex: 1
                                });
                            } else {
                                child.material[0] = crystalMaterial.clone();
                                crystalMeshes.push({
                                    mesh: child,
                                    primitiveIndex: 0
                                });
                            }
                        } else {
                            child.material = crystalMaterial.clone();
                            crystalMeshes.push({
                                mesh: child,
                                primitiveIndex: -1
                            });
                        }

                        child.castShadow = true;
                        child.receiveShadow = true;
                    }
                }
                
                // Check if child is a light
                if (child.isLight) {
                    modelPointLights.push(child);
                }
            });

            // Center and scale model
            const box = new THREE.Box3().setFromObject(model);
            const center = box.getCenter(new THREE.Vector3());
            const size = box.getSize(new THREE.Vector3());
            const maxDim = Math.max(size.x, size.y, size.z);
            const scale = 2 / maxDim;

            model.scale.setScalar(scale);
            model.position.sub(center.multiplyScalar(scale));

            scene.add(model);

            // Setup model lights if any found
            if (modelPointLights.length > 0) {
                setupModelLightControls();
                updateModelLights();
            }

            // Update status
            const modelName = path.split('/').pop();
            document.getElementById('model-status').textContent = modelName;
            document.getElementById('crystal-status').textContent = `${crystalCount} found`;
            document.getElementById('model-lights-count').textContent = `${modelPointLights.length} found`;

            if (onSuccess) onSuccess();
        },
        function (progress) {
            console.log('Model loading progress:', progress);
        },
        function (error) {
            console.error('Error loading model:', error);
            if (onError) onError(error);
        }
    );
}

function loadHDRIFromPath(path, onSuccess, onError) {
    const rgbeLoader = new THREE.RGBELoader();

    rgbeLoader.load(
        path,
        function (texture) {
            hdriTexture = pmremGenerator.fromEquirectangular(texture).texture;
            texture.dispose();
            enableHDRI();

            document.getElementById('hdri-status').textContent = 'Enabled';

            if (onSuccess) onSuccess();
        },
        function (progress) {
            console.log('HDRI loading progress:', progress);
        },
        function (error) {
            console.error('Error loading HDRI:', error);
            if (onError) onError(error);
        }
    );
}

function createDemoCube() {
    const loadingEl = document.getElementById('loading');
    const demoCubeEl = document.getElementById('demo-cube');

    loadingEl.style.display = 'block';
    demoCubeEl.style.display = 'none';

    if (currentModel) {
        scene.remove(currentModel);
        crystalMeshes = [];
        removeModelLights();
    }

    const geometry = new THREE.IcosahedronGeometry(1, 3);
    const cube = new THREE.Mesh(geometry, crystalMaterial.clone());
    cube.name = 'demoCrystal';
    cube.castShadow = true;
    cube.receiveShadow = true;
    cube.position.y = 0.5;

    scene.add(cube);
    currentModel = cube;

    crystalMeshes.push({
        mesh: cube,
        primitiveIndex: -1
    });

    document.getElementById('model-status').textContent = 'Demo Crystal Cube';
    document.getElementById('crystal-status').textContent = '1 found';
    document.getElementById('model-lights-count').textContent = '0 found';

    loadingEl.style.display = 'none';
    showMessage('Demo crystal cube created! Try the material presets.', 'success');
}

// MODEL LIGHTS FUNCTIONS
function setupModelLightControls() {
    // Create model light controls section if it doesn't exist
    const guiContainer = document.getElementById('gui-container');
    const lightingSection = document.querySelector('.gui-section:nth-child(2)');
    
    if (modelPointLights.length > 0) {
        // Add model lights count to status
        document.getElementById('model-lights-count').textContent = `${modelPointLights.length} found`;
        
        // Add model lighting controls to the lighting dropdown
        const lightingContent = lightingSection.querySelector('.dropdown-content');
        
        // Check if model light controls already exist
        if (!document.getElementById('model-lights-toggle')) {
            const modelLightControls = `
                <div class="gui-toggle" style="margin-top: 15px;">
                    <span class="gui-toggle-label">Model Lights</span>
                    <label class="gui-toggle-switch">
                        <input type="checkbox" id="model-lights-toggle" ${modelLightsEnabled ? 'checked' : ''} onchange="toggleModelLights()">
                        <span class="gui-toggle-slider"></span>
                    </label>
                </div>
                <div id="model-lights-controls" style="margin-top: 15px; ${!modelLightsEnabled ? 'display: none;' : ''}">
                    <div class="property-row">
                        <span class="property-label">Intensity</span>
                        <input type="range" id="model-lights-intensity" class="property-slider" min="0" max="3" step="0.1" value="${modelLightsIntensity}" oninput="updateModelLightsIntensity()">
                        <span id="model-lights-intensity-value" class="property-value">${modelLightsIntensity.toFixed(1)}</span>
                    </div>
                    <div class="property-row" style="margin-top: 10px;">
                        <span class="property-label">Color</span>
                        <input type="color" id="model-lights-color" class="gui-color" value="${modelLightsColor}" onchange="updateModelLightsColor()" style="width: 100%; height: 32px;">
                        <span id="model-lights-color-value" class="property-value">${modelLightsColor.toUpperCase()}</span>
                    </div>
                </div>
            `;
            
            // Insert after the existing lighting controls
            lightingContent.innerHTML += modelLightControls;
        }
    }
}

function toggleModelLights() {
    modelLightsEnabled = !modelLightsEnabled;
    updateModelLights();
    
    const controlsDiv = document.getElementById('model-lights-controls');
    if (controlsDiv) {
        controlsDiv.style.display = modelLightsEnabled ? 'block' : 'none';
    }
}

function updateModelLightsIntensity() {
    modelLightsIntensity = parseFloat(document.getElementById('model-lights-intensity').value);
    document.getElementById('model-lights-intensity-value').textContent = modelLightsIntensity.toFixed(1);
    updateModelLights();
}

function updateModelLightsColor() {
    modelLightsColor = document.getElementById('model-lights-color').value;
    document.getElementById('model-lights-color-value').textContent = modelLightsColor.toUpperCase();
    updateModelLights();
}

function updateModelLights() {
    if (modelPointLights.length === 0) return;
    
    modelPointLights.forEach(light => {
        light.visible = modelLightsEnabled;
        if (modelLightsEnabled) {
            light.intensity = modelLightsIntensity;
            light.color.setStyle(modelLightsColor);
        }
    });
}

function removeModelLights() {
    modelPointLights.forEach(light => {
        if (light.parent) {
            light.parent.remove(light);
        }
    });
    modelPointLights = [];
    modelLightsEnabled = false;
    
    // Remove model light controls from GUI
    const modelLightsToggle = document.getElementById('model-lights-toggle');
    const modelLightsControls = document.getElementById('model-lights-controls');
    if (modelLightsToggle) modelLightsToggle.remove();
    if (modelLightsControls) modelLightsControls.remove();
}

function handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    const uploadBtn = document.getElementById('upload-btn');
    const loadingEl = document.getElementById('loading');
    const demoCubeEl = document.getElementById('demo-cube');

    loadingEl.style.display = 'block';
    demoCubeEl.style.display = 'none';
    uploadBtn.disabled = true;

    const reader = new FileReader();

    reader.onload = function (e) {
        const arrayBuffer = e.target.result;
        const loader = new THREE.GLTFLoader();

        try {
            const dracoLoader = new THREE.DRACOLoader();
            dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/');
            dracoLoader.setDecoderConfig({ type: 'js' });
            loader.setDRACOLoader(dracoLoader);
        } catch (err) {
            console.warn('Draco loader setup failed, continuing without it');
        }

        loader.parse(
            arrayBuffer,
            '',
            function (gltf) {
                if (currentModel) {
                    scene.remove(currentModel);
                    crystalMeshes = [];
                    removeModelLights();
                }

                const model = gltf.scene;
                model.name = 'uploadedModel';
                currentModel = model;

                let crystalCount = 0;

                model.traverse(function (child) {
                    if (child.isMesh) {
                        const meshName = child.name.toLowerCase();
                        if (meshName.includes('crystal')) {
                            crystalCount++;

                            if (Array.isArray(child.material)) {
                                if (child.material.length > 1) {
                                    child.material[1] = crystalMaterial.clone();
                                    crystalMeshes.push({
                                        mesh: child,
                                        primitiveIndex: 1
                                    });
                                } else {
                                    child.material[0] = crystalMaterial.clone();
                                    crystalMeshes.push({
                                        mesh: child,
                                        primitiveIndex: 0
                                    });
                                }
                            } else {
                                child.material = crystalMaterial.clone();
                                crystalMeshes.push({
                                    mesh: child,
                                    primitiveIndex: -1
                                });
                            }

                            child.castShadow = true;
                            child.receiveShadow = true;
                        }
                    }
                    
                    // Check if child is a light
                    if (child.isLight) {
                        modelPointLights.push(child);
                    }
                });

                const box = new THREE.Box3().setFromObject(model);
                const center = box.getCenter(new THREE.Vector3());
                const size = box.getSize(new THREE.Vector3());
                const maxDim = Math.max(size.x, size.y, size.z);
                const scale = 2 / maxDim;

                model.scale.setScalar(scale);
                model.position.sub(center.multiplyScalar(scale));

                scene.add(model);

                // Setup model lights if any found
                if (modelPointLights.length > 0) {
                    setupModelLightControls();
                    updateModelLights();
                }

                if (hdriEnabled && hdriTexture) {
                    setTimeout(() => {
                        enableHDRI();
                    }, 100);
                }

                document.getElementById('model-status').textContent = file.name;
                document.getElementById('crystal-status').textContent = `${crystalCount} found`;
                document.getElementById('model-lights-count').textContent = `${modelPointLights.length} found`;

                loadingEl.style.display = 'none';
                uploadBtn.disabled = false;

                showMessage(`Model loaded successfully! Found ${crystalCount} crystal mesh(es) and ${modelPointLights.length} light(s).`, 'success');
            },
            undefined,
            function (error) {
                console.error('Error loading model:', error);
                loadingEl.style.display = 'none';
                uploadBtn.disabled = false;
                showMessage('Failed to load model: ' + error.message, 'error');
            }
        );
    };

    reader.onerror = function () {
        loadingEl.style.display = 'none';
        uploadBtn.disabled = false;
        showMessage('Failed to read file', 'error');
    };

    reader.readAsArrayBuffer(file);
}

// GUI Functions
function toggleDropdown(header) {
    const isActive = header.classList.contains('active');

    document.querySelectorAll('.dropdown-header').forEach(dropdown => {
        if (dropdown !== header) {
            dropdown.classList.remove('active');
        }
    });

    header.classList.toggle('active');
}

function toggleGUI() {
    const gui = document.getElementById('gui-container');
    const btn = document.getElementById('toggle-gui-btn');

    guiVisible = !guiVisible;

    if (guiVisible) {
        gui.style.display = 'block';
        btn.innerHTML = '<svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg><span>Hide</span>';
    } else {
        gui.style.display = 'none';
        btn.innerHTML = '<svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"/></svg><span>Controls</span>';
    }
}

function toggleMode() {
    nightMode = !nightMode;
    const body = document.body;
    const btn = document.getElementById('toggle-mode-btn');

    if (nightMode) {
        body.classList.remove('day-mode');
        body.classList.add('night-mode');
        btn.innerHTML = '<svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/></svg><span>Dark</span>';

        scene.background = new THREE.Color(0x0a0a0a);
        scene.fog = new THREE.Fog(0x0a0a0a, 10, 50);

        ambientLight.intensity = 0.1;
        keyLight.intensity = 1.2;
        keyLight.color.setHex(0x6688ff);
        fillLight.intensity = 0.8;
        fillLight.color.setHex(0x4455aa);
    } else {
        body.classList.remove('night-mode');
        body.classList.add('day-mode');
        btn.innerHTML = '<svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/></svg><span>Light</span>';

        scene.background = new THREE.Color(0xf5f5f5);
        scene.fog = new THREE.Fog(0xf5f5f5, 10, 50);

        ambientLight.intensity = 0.4;
        keyLight.intensity = 2.5;
        keyLight.color.setHex(0xffffff);
        fillLight.intensity = 1.2;
        fillLight.color.setHex(0xaaccff);
    }

    updateLightingGUI();
}

// Updated HDRI toggle function - now just toggles on/off
function toggleHDRI() {
    if (isHDRIChanging) return;

    if (!hdriEnabled) {
        // If we don't have HDRI texture loaded, try to load default
        if (!hdriTexture) {
            loadHDRIFromPath(DEFAULT_HDRI_PATH, 
                function () {
                    showMessage('HDRI enabled!', 'success');
                },
                function () {
                    showMessage('Default HDRI not found. Please upload an HDRI file.', 'warning');
                    // Show file input for HDRI upload
                    document.getElementById('hdri-input').click();
                }
            );
        } else {
            enableHDRI();
        }
    } else {
        disableHDRI();
    }
}

function handleHDRIUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    isHDRIChanging = true;
    showMessage('Loading HDRI...', 'info');

    const reader = new FileReader();

    reader.onload = function (e) {
        const rgbeLoader = new THREE.RGBELoader();

        rgbeLoader.load(
            URL.createObjectURL(file),
            function (texture) {
                hdriTexture = pmremGenerator.fromEquirectangular(texture).texture;
                texture.dispose();
                enableHDRI();
                showMessage('HDRI loaded successfully!', 'success');
                isHDRIChanging = false;
            },
            undefined,
            function (error) {
                console.error('Error loading HDRI:', error);
                showMessage('Failed to load HDRI file', 'error');
                isHDRIChanging = false;
            }
        );
    };

    reader.onerror = function () {
        showMessage('Failed to read HDRI file', 'error');
        isHDRIChanging = false;
    };

    reader.readAsArrayBuffer(file);
}

function enableHDRI() {
    if (!hdriTexture) {
        showMessage('No HDRI texture available', 'error');
        return;
    }

    hdriEnabled = true;
    scene.environment = hdriTexture;

    document.getElementById('hdri-status').textContent = 'Enabled';
    document.getElementById('toggle-hdri-btn').innerHTML = '<svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/></svg><span>HDRI</span>';
}

function disableHDRI() {
    hdriEnabled = false;
    scene.environment = null;

    document.getElementById('hdri-status').textContent = 'Disabled';
    document.getElementById('toggle-hdri-btn').innerHTML = '<svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"/></svg><span>HDRI</span>';
}

// HDRI Tone Mapping Functions
function updateHDRIExposure() {
    currentHDRIExposure = parseFloat(document.getElementById('hdri-exposure').value);
    renderer.toneMappingExposure = currentHDRIExposure;
    document.getElementById('hdri-exposure-value').textContent = currentHDRIExposure.toFixed(1);
}

function updateToneMapping() {
    const toneMappingType = document.getElementById('tone-mapping').value;
    currentToneMapping = toneMappingPresets[toneMappingType];
    renderer.toneMapping = currentToneMapping;
    document.getElementById('tone-mapping-value').textContent = toneMappingType;
}

// Removed HDRI rotation functions

function toggleLightsRotation() {
    rotateLights = document.getElementById('rotate-lights').checked;
}

// Updated material update function with new parameters
function updateMaterial() {
    if (crystalMeshes.length === 0) return;

    // Basic properties
    const color = document.getElementById('material-color').value;
    const opacity = parseFloat(document.getElementById('material-opacity').value);
    const ior = parseFloat(document.getElementById('material-ior').value);
    const roughness = parseFloat(document.getElementById('material-roughness').value);
    const transmission = parseFloat(document.getElementById('material-transmission').value);
    const thickness = parseFloat(document.getElementById('material-thickness').value);
    
    // Clearcoat properties
    const clearcoat = parseFloat(document.getElementById('material-clearcoat').value);
    const clearcoatRoughness = parseFloat(document.getElementById('material-clearcoat-roughness').value);
    
    // Sheen properties
    const sheen = parseFloat(document.getElementById('material-sheen').value);
    const sheenRoughness = parseFloat(document.getElementById('material-sheen-roughness').value);
    const sheenColor = document.getElementById('material-sheen-color').value;
    
    // Specular properties
    const specularIntensity = parseFloat(document.getElementById('material-specular-intensity').value);
    const specularColor = document.getElementById('material-specular-color').value;
    
    // Attenuation properties
    const attenuationColor = document.getElementById('material-attenuation-color').value;
    const attenuationDistance = parseFloat(document.getElementById('material-attenuation-distance').value);
    
    // Anisotropy properties
    const anisotropy = parseFloat(document.getElementById('material-anisotropy').value);
    const anisotropyRotation = parseFloat(document.getElementById('material-anisotropy-rotation').value);
    
    // Environment properties
    const envMapIntensity = parseFloat(document.getElementById('material-env-intensity').value);
    
    // Emissive properties
    const emissiveIntensity = parseFloat(document.getElementById('material-emissive-intensity').value);
    const emissiveColor = document.getElementById('material-emissive-color').value;

    // Update display values
    document.getElementById('color-value').textContent = color.toUpperCase();
    document.getElementById('opacity-value').textContent = opacity.toFixed(2);
    document.getElementById('ior-value').textContent = ior.toFixed(2);
    document.getElementById('roughness-value').textContent = roughness.toFixed(2);
    document.getElementById('transmission-value').textContent = transmission.toFixed(2);
    document.getElementById('thickness-value').textContent = thickness.toFixed(1);
    document.getElementById('clearcoat-value').textContent = clearcoat.toFixed(2);
    document.getElementById('clearcoat-roughness-value').textContent = clearcoatRoughness.toFixed(2);
    document.getElementById('sheen-value').textContent = sheen.toFixed(2);
    document.getElementById('sheen-roughness-value').textContent = sheenRoughness.toFixed(2);
    document.getElementById('sheen-color-value').textContent = sheenColor.toUpperCase();
    document.getElementById('specular-intensity-value').textContent = specularIntensity.toFixed(2);
    document.getElementById('specular-color-value').textContent = specularColor.toUpperCase();
    document.getElementById('attenuation-color-value').textContent = attenuationColor.toUpperCase();
    document.getElementById('attenuation-distance-value').textContent = attenuationDistance.toFixed(1);
    document.getElementById('anisotropy-value').textContent = anisotropy.toFixed(2);
    document.getElementById('anisotropy-rotation-value').textContent = anisotropyRotation.toFixed(2);
    document.getElementById('env-intensity-value').textContent = envMapIntensity.toFixed(1);
    document.getElementById('emissive-intensity-value').textContent = emissiveIntensity.toFixed(1);
    document.getElementById('emissive-color-value').textContent = emissiveColor.toUpperCase();

    crystalMeshes.forEach(crystalData => {
        const mesh = crystalData.mesh;
        const primitiveIndex = crystalData.primitiveIndex;

        let material;
        if (primitiveIndex === -1) {
            material = mesh.material;
        } else if (Array.isArray(mesh.material)) {
            material = mesh.material[primitiveIndex];
        } else {
            material = mesh.material;
        }

        if (material) {
            // Basic properties
            material.color.setStyle(color);
            material.opacity = opacity;
            material.ior = ior;
            material.roughness = roughness;
            material.transmission = transmission;
            material.thickness = thickness;
            
            // Clearcoat properties
            material.clearcoat = clearcoat;
            material.clearcoatRoughness = clearcoatRoughness;
            
            // Sheen properties
            material.sheen = sheen;
            material.sheenRoughness = sheenRoughness;
            material.sheenColor.setStyle(sheenColor);
            
            // Specular properties
            material.specularIntensity = specularIntensity;
            material.specularColor.setStyle(specularColor);
            
            // Attenuation properties
            material.attenuationColor.setStyle(attenuationColor);
            material.attenuationDistance = attenuationDistance;
            
            // Anisotropy properties
            material.anisotropy = anisotropy;
            material.anisotropyRotation = anisotropyRotation;
            
            // Environment properties
            material.envMapIntensity = envMapIntensity;
            
            // Emissive properties
            material.emissive.setStyle(emissiveColor);
            material.emissiveIntensity = emissiveIntensity;
            
            material.needsUpdate = true;
        }
    });
}

function updateLighting() {
    const mainIntensity = parseFloat(document.getElementById('main-light').value);
    const fillIntensity = parseFloat(document.getElementById('fill-light').value);
    const ambientIntensity = parseFloat(document.getElementById('ambient-light').value);

    document.getElementById('main-light-value').textContent = mainIntensity.toFixed(1);
    document.getElementById('fill-light-value').textContent = fillIntensity.toFixed(1);
    document.getElementById('ambient-value').textContent = ambientIntensity.toFixed(1);

    keyLight.intensity = mainIntensity;
    fillLight.intensity = fillIntensity;
    ambientLight.intensity = ambientIntensity;
}

function updateLightingGUI() {
    if (nightMode) {
        document.getElementById('main-light').value = 1.2;
        document.getElementById('fill-light').value = 0.8;
        document.getElementById('ambient-light').value = 0.1;
    } else {
        document.getElementById('main-light').value = 2.5;
        document.getElementById('fill-light').value = 1.2;
        document.getElementById('ambient-light').value = 0.4;
    }
    updateLighting();
}

function applyPreset(presetName) {
    const preset = presets[presetName];
    if (!preset) return;

    // Basic properties
    document.getElementById('material-color').value = preset.color;
    document.getElementById('material-opacity').value = preset.opacity;
    document.getElementById('material-ior').value = preset.ior;
    document.getElementById('material-roughness').value = preset.roughness;
    document.getElementById('material-transmission').value = preset.transmission;
    document.getElementById('material-thickness').value = preset.thickness;
    
    // Clearcoat properties
    document.getElementById('material-clearcoat').value = preset.clearcoat;
    document.getElementById('material-clearcoat-roughness').value = preset.clearcoatRoughness;
    
    // Sheen properties
    document.getElementById('material-sheen').value = preset.sheen;
    document.getElementById('material-sheen-roughness').value = preset.sheenRoughness;
    document.getElementById('material-sheen-color').value = preset.sheenColor;
    
    // Specular properties
    document.getElementById('material-specular-intensity').value = preset.specularIntensity;
    document.getElementById('material-specular-color').value = preset.specularColor;
    
    // Attenuation properties
    document.getElementById('material-attenuation-color').value = preset.attenuationColor;
    document.getElementById('material-attenuation-distance').value = preset.attenuationDistance;
    
    // Anisotropy properties
    document.getElementById('material-anisotropy').value = preset.anisotropy;
    document.getElementById('material-anisotropy-rotation').value = preset.anisotropyRotation;
    
    // Environment properties
    document.getElementById('material-env-intensity').value = preset.envMapIntensity;
    
    // Emissive properties
    document.getElementById('material-emissive-intensity').value = preset.emissiveIntensity;
    document.getElementById('material-emissive-color').value = preset.emissiveColor;

    updateMaterial();

    document.querySelectorAll('.preset-button').forEach(btn => {
        btn.classList.remove('active');
    });
    const presetButton = document.querySelector(`[data-preset="${presetName}"]`);
    if (presetButton) {
        presetButton.classList.add('active');
    }
}

function resetMaterial() {
    applyPreset('realistic');
}

function copySettings() {
    const settings = {
        color: document.getElementById('material-color').value,
        opacity: document.getElementById('material-opacity').value,
        ior: document.getElementById('material-ior').value,
        roughness: document.getElementById('material-roughness').value,
        transmission: document.getElementById('material-transmission').value,
        thickness: document.getElementById('material-thickness').value,
        clearcoat: document.getElementById('material-clearcoat').value,
        clearcoatRoughness: document.getElementById('material-clearcoat-roughness').value,
        sheen: document.getElementById('material-sheen').value,
        sheenRoughness: document.getElementById('material-sheen-roughness').value,
        sheenColor: document.getElementById('material-sheen-color').value,
        specularIntensity: document.getElementById('material-specular-intensity').value,
        specularColor: document.getElementById('material-specular-color').value,
        attenuationColor: document.getElementById('material-attenuation-color').value,
        attenuationDistance: document.getElementById('material-attenuation-distance').value,
        anisotropy: document.getElementById('material-anisotropy').value,
        anisotropyRotation: document.getElementById('material-anisotropy-rotation').value,
        envMapIntensity: document.getElementById('material-env-intensity').value,
        emissiveIntensity: document.getElementById('material-emissive-intensity').value,
        emissiveColor: document.getElementById('material-emissive-color').value
    };

    navigator.clipboard.writeText(JSON.stringify(settings, null, 2))
        .then(() => showMessage('Settings copied to clipboard!', 'success'))
        .catch(() => showMessage('Failed to copy settings', 'error'));
}

function showMessage(text, type = 'info') {
    const errorMsg = document.getElementById('error-msg');
    errorMsg.textContent = text;
    errorMsg.style.display = 'block';

    if (type === 'error') {
        errorMsg.style.background = 'rgba(239, 68, 68, 0.9)';
    } else if (type === 'success') {
        errorMsg.style.background = 'rgba(16, 185, 129, 0.9)';
    } else if (type === 'warning') {
        errorMsg.style.background = 'rgba(245, 158, 11, 0.9)';
    } else {
        errorMsg.style.background = 'rgba(59, 130, 246, 0.9)';
    }

    setTimeout(() => {
        errorMsg.style.display = 'none';
    }, 3000);
}

window.addEventListener('load', init);