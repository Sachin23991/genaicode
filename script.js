// CareerForge - Advanced 3D Interactive Landing Page
class CareerForgeEngine {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.currentPhase = 1;
        this.isLoading = true;
        this.objects = {};
        this.particles = [];
        this.mouse = { x: 0, y: 0 };
        this.clock = new THREE.Clock();
        
        // Loading progress
        this.loadingProgress = 0;
        this.loadingMessages = [
            "Igniting your potential...",
            "Forging neural pathways...",
            "Crystallizing opportunities...",
            "Illuminating your future...",
            "Ready to transform your career!"
        ];
        this.currentMessageIndex = 0;
        
        this.init();
    }

    async init() {
        this.startLoadingSequence();
        this.createParticleField();
        this.setupEventListeners();
        await this.setupThreeJS();
        this.createPhaseObjects();
        this.setupScrollTriggers();
       // this.setupAnimations();
        this.animate();
        
        // Complete loading after setup
        setTimeout(() => this.completeLoading(), 3000);
    }

    // Loading Animation System
    startLoadingSequence() {
        const progressFill = document.getElementById('progress-fill');
        const progressPercentage = document.getElementById('progress-percentage');
        const loadingMessage = document.getElementById('loading-message');
        
        const loadingInterval = setInterval(() => {
            this.loadingProgress += Math.random() * 15 + 5;
            
            if (this.loadingProgress >= 100) {
                this.loadingProgress = 100;
                clearInterval(loadingInterval);
            }
            
            // Update progress bar
            if (progressFill) {
                progressFill.style.width = `${this.loadingProgress}%`;
            }
            
            if (progressPercentage) {
                progressPercentage.textContent = `${Math.floor(this.loadingProgress)}%`;
            }
            
            // Update loading message
            if (loadingMessage && this.loadingProgress > (this.currentMessageIndex + 1) * 20) {
                this.currentMessageIndex++;
                if (this.currentMessageIndex < this.loadingMessages.length) {
                    this.typeText(loadingMessage, this.loadingMessages[this.currentMessageIndex]);
                }
            }
        }, 200);
    }

    typeText(element, text) {
        element.textContent = '';
        let i = 0;
        const typeInterval = setInterval(() => {
            element.textContent += text[i];
            i++;
            if (i >= text.length) {
                clearInterval(typeInterval);
            }
        }, 50);
    }

    completeLoading() {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            gsap.to(loadingScreen, {
                opacity: 0,
                duration: 1,
                ease: "power2.out",
                onComplete: () => {
                    loadingScreen.classList.add('hidden');
                    this.isLoading = false;
                    this.startInitialAnimations();
                }
            });
        }
    }

    // Three.js Setup
    async setupThreeJS() {
        try {
            // Scene setup
            this.scene = new THREE.Scene();
            this.scene.background = new THREE.Color(0x0a0a0a);
            this.scene.fog = new THREE.Fog(0x0a0a0a, 50, 200);

            // Camera setup
            this.camera = new THREE.PerspectiveCamera(
                75,
                window.innerWidth / window.innerHeight,
                0.1,
                1000
            );
            this.camera.position.set(0, 0, 50);

            // Renderer setup
            const canvas = document.getElementById('three-canvas');
            this.renderer = new THREE.WebGLRenderer({
                canvas: canvas,
                antialias: true,
                alpha: true
            });
            this.renderer.setSize(window.innerWidth, window.innerHeight);
            this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            this.renderer.shadowMap.enabled = true;
            this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

            // Lighting setup
            this.setupLighting();

        } catch (error) {
            console.error('Three.js setup failed:', error);
        }
    }

    setupLighting() {
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0x00ffff, 0.3);
        this.scene.add(ambientLight);

        // Primary point light
        const pointLight1 = new THREE.PointLight(0x00ffff, 2, 100);
        pointLight1.position.set(10, 10, 10);
        pointLight1.castShadow = true;
        this.scene.add(pointLight1);

        // Secondary point light
        const pointLight2 = new THREE.PointLight(0xff6b6b, 1.5, 80);
        pointLight2.position.set(-10, -10, 15);
        this.scene.add(pointLight2);

        // Directional light
        const directionalLight = new THREE.DirectionalLight(0x8b5cf6, 1);
        directionalLight.position.set(0, 20, 10);
        directionalLight.castShadow = true;
        this.scene.add(directionalLight);

        // Animated light movement
        gsap.to(pointLight1.position, {
            duration: 8,
            x: -10,
            z: 20,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });

        gsap.to(pointLight2.position, {
            duration: 6,
            x: 15,
            y: 5,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });
    }

    // Phase Objects Creation
    createPhaseObjects() {
        this.createPotentialOrb();        // Phase 1
        this.createBlueprintLines();      // Phase 2
        this.createNarrativeCrystal();    // Phase 3
        this.createOpportunityCity();     // Phase 4
        this.createAmbientParticles();
        this.createEnergyField();
    }

    // Phase 1: Potential Orb
    createPotentialOrb() {
        const geometry = new THREE.SphereGeometry(5, 64, 64);
        
        // Custom shader for complex neural network effect
        const material = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                color1: { value: new THREE.Color(0x00ffff) },
                color2: { value: new THREE.Color(0x8b5cf6) },
                complexity: { value: 0.5 }
            },
            vertexShader: `
                varying vec2 vUv;
                varying vec3 vPosition;
                varying vec3 vNormal;
                uniform float time;
                
                void main() {
                    vUv = uv;
                    vPosition = position;
                    vNormal = normal;
                    
                    vec3 newPosition = position;
                    float noise = sin(position.x * 2.0 + time) * 
                                  sin(position.y * 2.0 + time * 0.8) * 
                                  sin(position.z * 2.0 + time * 1.2) * 0.3;
                    newPosition += normal * noise;
                    
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
                }
            `,
            fragmentShader: `
                uniform float time;
                uniform vec3 color1;
                uniform vec3 color2;
                uniform float complexity;
                varying vec2 vUv;
                varying vec3 vPosition;
                varying vec3 vNormal;
                
                float random(vec2 st) {
                    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
                }
                
                float noise(vec2 st) {
                    vec2 i = floor(st);
                    vec2 f = fract(st);
                    float a = random(i);
                    float b = random(i + vec2(1.0, 0.0));
                    float c = random(i + vec2(0.0, 1.0));
                    float d = random(i + vec2(1.0, 1.0));
                    vec2 u = f * f * (3.0 - 2.0 * f);
                    return mix(a, b, u.x) + (c - a)* u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
                }
                
                void main() {
                    vec2 st = vUv * 8.0;
                    float n = noise(st + time * 0.1);
                    n += noise(st * 2.0 + time * 0.2) * 0.5;
                    n += noise(st * 4.0 + time * 0.4) * 0.25;
                    
                    vec3 color = mix(color1, color2, n);
                    float fresnel = dot(vNormal, vec3(0.0, 0.0, 1.0));
                    float alpha = 0.6 + fresnel * 0.4;
                    
                    gl_FragColor = vec4(color, alpha);
                }
            `,
            transparent: true,
            side: THREE.DoubleSide
        });

        const orb = new THREE.Mesh(geometry, material);
        orb.position.set(0, 0, 0);
        orb.visible = true;
        
        this.objects.potentialOrb = orb;
        this.scene.add(orb);

        // Add orbital rings
        this.createOrbitalRings(orb);
    }

    createOrbitalRings(parent) {
        for (let i = 0; i < 3; i++) {
            const ringGeometry = new THREE.TorusGeometry(8 + i * 3, 0.1, 8, 64);
            const ringMaterial = new THREE.MeshBasicMaterial({
                color: 0x00ffff,
                transparent: true,
                opacity: 0.3
            });
            
            const ring = new THREE.Mesh(ringGeometry, ringMaterial);
            ring.rotation.x = Math.random() * Math.PI;
            ring.rotation.y = Math.random() * Math.PI;
            ring.rotation.z = Math.random() * Math.PI;
            
            parent.add(ring);
            
            // Animate rings
            gsap.to(ring.rotation, {
                duration: 10 + i * 5,
                x: ring.rotation.x + Math.PI * 2,
                repeat: -1,
                ease: "none"
            });
        }
    }

    // Phase 2: Blueprint Lines
    createBlueprintLines() {
        const group = new THREE.Group();
        const points = [];
        
        // Create structured path points
        for (let i = 0; i < 20; i++) {
            const angle = (i / 20) * Math.PI * 2;
            const radius = 10 + Math.sin(i * 0.5) * 5;
            points.push(new THREE.Vector3(
                Math.cos(angle) * radius,
                Math.sin(angle) * radius,
                Math.sin(i * 0.3) * 5
            ));
        }
        
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const material = new THREE.LineBasicMaterial({
            color: 0x00ffff,
            transparent: true,
            opacity: 0.8
        });
        
        const line = new THREE.Line(geometry, material);
        group.add(line);
        
        // Add connection nodes
        points.forEach((point, index) => {
            const nodeGeometry = new THREE.SphereGeometry(0.5, 16, 16);
            const nodeMaterial = new THREE.MeshBasicMaterial({
                color: 0x8b5cf6,
                transparent: true,
                opacity: 0.8
            });
            
            const node = new THREE.Mesh(nodeGeometry, nodeMaterial);
            node.position.copy(point);
            group.add(node);
            
            // Animate nodes
            gsap.to(node.scale, {
                duration: 1 + index * 0.1,
                x: 1.5,
                y: 1.5,
                z: 1.5,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut"
            });
        });
        
        group.visible = false;
        this.objects.blueprintLines = group;
        this.scene.add(group);
    }

    // Phase 3: Narrative Crystal
    createNarrativeCrystal() {
        const group = new THREE.Group();
        
        // Main crystal
        const crystalGeometry = new THREE.OctahedronGeometry(6, 2);
        const crystalMaterial = new THREE.MeshPhysicalMaterial({
            color: 0x00ffff,
            metalness: 0.1,
            roughness: 0.1,
            transmission: 0.9,
            transparent: true,
            opacity: 0.8,
            reflectivity: 1,
            clearcoat: 1.0,
            clearcoatRoughness: 0.1
        });
        
        const crystal = new THREE.Mesh(crystalGeometry, crystalMaterial);
        group.add(crystal);
        
        // Energy emanations
        for (let i = 0; i < 12; i++) {
            const emanationGeometry = new THREE.PlaneGeometry(1, 8);
            const emanationMaterial = new THREE.MeshBasicMaterial({
                color: 0x8b5cf6,
                transparent: true,
                opacity: 0.3,
                side: THREE.DoubleSide
            });
            
            const emanation = new THREE.Mesh(emanationGeometry, emanationMaterial);
            emanation.position.set(
                Math.random() * 20 - 10,
                Math.random() * 20 - 10,
                Math.random() * 20 - 10
            );
            emanation.lookAt(crystal.position);
            
            group.add(emanation);
            
            // Animate emanations
            gsap.to(emanation.material, {
                duration: 2 + Math.random() * 2,
                opacity: 0.6,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut"
            });
        }
        
        group.visible = false;
        this.objects.narrativeCrystal = group;
        this.scene.add(group);
    }

    // Phase 4: Opportunity City
    createOpportunityCity() {
        const group = new THREE.Group();
        
        // Create city buildings
        for (let i = 0; i < 30; i++) {
            const height = Math.random() * 20 + 5;
            const width = Math.random() * 3 + 1;
            const depth = Math.random() * 3 + 1;
            
            const buildingGeometry = new THREE.BoxGeometry(width, height, depth);
            const buildingMaterial = new THREE.MeshLambertMaterial({
                color: new THREE.Color().setHSL(0.55 + Math.random() * 0.1, 0.7, 0.6),
                transparent: true,
                opacity: 0.8
            });
            
            const building = new THREE.Mesh(buildingGeometry, buildingMaterial);
            building.position.set(
                (Math.random() - 0.5) * 60,
                height / 2,
                (Math.random() - 0.5) * 60
            );
            
            group.add(building);
            
            // Add building lights
            const lightGeometry = new THREE.PlaneGeometry(0.5, 0.5);
            const lightMaterial = new THREE.MeshBasicMaterial({
                color: 0xffff00,
                transparent: true,
                opacity: 0.8
            });
            
            for (let j = 0; j < Math.floor(height / 3); j++) {
                const light = new THREE.Mesh(lightGeometry, lightMaterial);
                light.position.set(
                    building.position.x + (Math.random() - 0.5) * width,
                    j * 3 + 2,
                    building.position.z + width / 2 + 0.1
                );
                group.add(light);
                
                // Animate lights
                gsap.to(light.material, {
                    duration: 1 + Math.random() * 2,
                    opacity: Math.random() * 0.8 + 0.2,
                    repeat: -1,
                    yoyo: true,
                    ease: "sine.inOut"
                });
            }
        }
        
        group.visible = false;
        this.objects.opportunityCity = group;
        this.scene.add(group);
    }

    // Ambient Particles
    createAmbientParticles() {
        const particleCount = 500;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        const sizes = new Float32Array(particleCount);
        
        for (let i = 0; i < particleCount; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 200;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 200;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 200;
            
            const color = new THREE.Color();
            color.setHSL(Math.random() * 0.3 + 0.5, 1, 0.5);
            colors[i * 3] = color.r;
            colors[i * 3 + 1] = color.g;
            colors[i * 3 + 2] = color.b;
            
            sizes[i] = Math.random() * 3 + 1;
        }
        
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
        
        const material = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 }
            },
            vertexShader: `
                attribute float size;
                uniform float time;
                varying vec3 vColor;
                
                void main() {
                    vColor = color;
                    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                    gl_PointSize = size * (300.0 / -mvPosition.z);
                    gl_Position = projectionMatrix * mvPosition;
                }
            `,
            fragmentShader: `
                varying vec3 vColor;
                
                void main() {
                    float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
                    float alpha = 1.0 - smoothstep(0.0, 0.5, distanceToCenter);
                    gl_FragColor = vec4(vColor, alpha);
                }
            `,
            transparent: true,
            vertexColors: true
        });
        
        const particles = new THREE.Points(geometry, material);
        this.objects.ambientParticles = particles;
        this.scene.add(particles);
    }

    // Energy Field
    createEnergyField() {
        const group = new THREE.Group();
        
        for (let i = 0; i < 5; i++) {
            const fieldGeometry = new THREE.TorusGeometry(20 + i * 10, 0.5, 8, 64);
            const fieldMaterial = new THREE.MeshBasicMaterial({
                color: 0x00ffff,
                transparent: true,
                opacity: 0.1 - i * 0.02
            });
            
            const field = new THREE.Mesh(fieldGeometry, fieldMaterial);
            field.rotation.x = Math.random() * Math.PI;
            field.rotation.y = Math.random() * Math.PI;
            group.add(field);
            
            // Animate energy field
            gsap.to(field.rotation, {
                duration: 30 + i * 10,
                z: Math.PI * 2,
                repeat: -1,
                ease: "none"
            });
        }
        
        this.objects.energyField = group;
        this.scene.add(group);
    }

    // Particle Field Creation
    createParticleField() {
        const particleField = document.getElementById('particle-field');
        
        for (let i = 0; i < 50; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.animationDelay = `${Math.random() * 15}s`;
            particle.style.animationDuration = `${15 + Math.random() * 10}s`;
            particleField.appendChild(particle);
        }
    }

    // Event Listeners
    setupEventListeners() {
        // Mouse movement
        document.addEventListener('mousemove', (event) => {
            this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
            
            // Update custom cursor
            const cursor = document.querySelector('body::after');
            gsap.to('body::after', {
                x: event.clientX,
                y: event.clientY,
                duration: 0.1
            });
        });

        // Window resize
        window.addEventListener('resize', () => this.handleResize());
        
        // Scroll progress
        window.addEventListener('scroll', () => this.updateScrollProgress());
        
        // Navigation
        this.setupNavigation();
    }

    setupNavigation() {
        // Hamburger menu
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');
        
        if (hamburger && navMenu) {
            hamburger.addEventListener('click', () => {
                hamburger.classList.toggle('active');
                navMenu.classList.toggle('active');
            });
        }
        
        // Smooth scroll for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    gsap.to(window, {
                        scrollTo: target,
                        duration: 2,
                        ease: "power2.inOut"
                    });
                }
            });
        });
        
        // Navbar scroll effect
        window.addEventListener('scroll', () => {
            const navbar = document.querySelector('.navbar');
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    // Scroll Triggers Setup
    setupScrollTriggers() {
        gsap.registerPlugin(ScrollTrigger);
        
        // Phase transitions
        const phases = document.querySelectorAll('.phase-section');
        phases.forEach((phase, index) => {
            ScrollTrigger.create({
                trigger: phase,
                start: "top center",
                end: "bottom center",
                onEnter: () => this.transitionToPhase(index + 1),
                onEnterBack: () => this.transitionToPhase(index + 1)
            });
        });
        
        // Camera animations
        this.setupCameraAnimations();
        
        // Object animations
        this.setupObjectAnimations();
    }

    setupCameraAnimations() {
        // Phase 1 to 2
        ScrollTrigger.create({
            trigger: "#phase-2",
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
            animation: gsap.to(this.camera.position, {
                z: 35,
                y: 5
            })
        });
        
        // Phase 2 to 3
        ScrollTrigger.create({
            trigger: "#phase-3",
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
            animation: gsap.to(this.camera.position, {
                z: 45,
                y: 10,
                x: 10
            })
        });
        
        // Phase 3 to 4
        ScrollTrigger.create({
            trigger: "#phase-4",
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
            animation: gsap.to(this.camera.position, {
                z: 80,
                y: 30,
                x: 0
            })
        });
    }

    setupObjectAnimations() {
        // Animate stats on phase 3
        ScrollTrigger.create({
            trigger: "#phase-3",
            start: "top center",
            onEnter: () => this.animateStats()
        });
    }

    // Phase Transition Logic
    transitionToPhase(phaseNumber) {
        if (this.currentPhase === phaseNumber) return;
        
        console.log(`Transitioning to Phase ${phaseNumber}`);
        this.currentPhase = phaseNumber;
        
        // Hide all objects
        Object.values(this.objects).forEach(obj => {
            if (obj.visible !== undefined) {
                gsap.to(obj.scale, {
                    duration: 0.5,
                    x: 0,
                    y: 0,
                    z: 0,
                    ease: "power2.in",
                    onComplete: () => {
                        obj.visible = false;
                    }
                });
            }
        });
        
        // Show phase-specific objects
        setTimeout(() => {
            this.showPhaseObjects(phaseNumber);
            this.updatePhaseUI(phaseNumber);
        }, 600);
    }

    showPhaseObjects(phaseNumber) {
        const showObject = (obj) => {
            if (obj) {
                obj.visible = true;
                obj.scale.set(0, 0, 0);
                gsap.to(obj.scale, {
                    duration: 1,
                    x: 1,
                    y: 1,
                    z: 1,
                    ease: "back.out(1.7)"
                });
            }
        };
        
        // Always show ambient elements
        showObject(this.objects.ambientParticles);
        showObject(this.objects.energyField);
        
        switch (phaseNumber) {
            case 1:
                showObject(this.objects.potentialOrb);
                break;
            case 2:
                showObject(this.objects.blueprintLines);
                break;
            case 3:
                showObject(this.objects.narrativeCrystal);
                break;
            case 4:
                showObject(this.objects.opportunityCity);
                break;
        }
    }

    updatePhaseUI(phaseNumber) {
        // Update phase sections
        document.querySelectorAll('.phase-section').forEach((section, index) => {
            section.classList.toggle('active', index + 1 === phaseNumber);
        });
        
        // Update phase indicators
        document.querySelectorAll('.phase-dot').forEach((dot, index) => {
            dot.classList.toggle('active', index + 1 === phaseNumber);
        });
        
        // Update progress markers
        document.querySelectorAll('.marker').forEach((marker, index) => {
            marker.classList.toggle('active', index + 1 === phaseNumber);
        });
    }

    // Animation Functions
    animateStats() {
        document.querySelectorAll('.stat-number').forEach(stat => {
            const target = parseInt(stat.getAttribute('data-target'));
            
            gsap.to(stat, {
                innerHTML: target,
                duration: 2,
                ease: "power2.out",
                snap: { innerHTML: 1 },
                /*onUpdate: function() {
                    stat.innerHTML = Math.floor(stat.innerHTML);
                }*/
            });
        });
    }

    updateScrollProgress() {
        const scrollProgress = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
        const progressThumb = document.getElementById('progress-thumb');
        
        if (progressThumb) {
            const maxTop = 180; // Track height minus thumb height
            progressThumb.style.top = `${scrollProgress * maxTop}px`;
        }
    }

    // Initial Animations
    startInitialAnimations() {
        // Navbar animation
        gsap.from('.navbar', {
            y: -100,
            opacity: 0,
            duration: 1,
            ease: "back.out(1.7)"
        });
        
        // Hero content animations
        gsap.timeline()
            .from('.phase-indicator', {
                scale: 0,
                rotation: 180,
                duration: 1,
                ease: "back.out(1.7)"
            })
            .from('.title-line', {
                y: 100,
                opacity: 0,
                duration: 1,
                stagger: 0.2,
                ease: "back.out(1.7)"
            }, "-=0.5")
            .from('.hero-description', {
                y: 50,
                opacity: 0,
                duration: 1,
                ease: "power2.out"
            }, "-=0.3")
            .from('.hero-actions > *', {
                scale: 0,
                rotation: 180,
                duration: 0.8,
                stagger: 0.1,
                ease: "back.out(1.7)"
            }, "-=0.3");
        
        // Progress indicator animation
        gsap.from('.progress-indicator', {
            x: 100,
            opacity: 0,
            duration: 1,
            delay: 1,
            ease: "power2.out"
        });
    }

    // Main Animation Loop
    animate() {
        requestAnimationFrame(() => this.animate());
        
        if (!this.renderer || this.isLoading) return;
        
        const elapsedTime = this.clock.getElapsedTime();
        
        // Update object animations
        this.updateObjectAnimations(elapsedTime);
        
        // Mouse interaction effects
        this.updateMouseEffects();
        
        // Render scene
        this.renderer.render(this.scene, this.camera);
    }

    updateObjectAnimations(time) {
        // Potential Orb animations
        if (this.objects.potentialOrb && this.objects.potentialOrb.visible) {
            this.objects.potentialOrb.material.uniforms.time.value = time;
            this.objects.potentialOrb.rotation.y += 0.01;
            this.objects.potentialOrb.rotation.x += 0.005;
        }
        
        // Blueprint Lines animations
        if (this.objects.blueprintLines && this.objects.blueprintLines.visible) {
            this.objects.blueprintLines.rotation.z += 0.008;
        }
        
        // Narrative Crystal animations
        if (this.objects.narrativeCrystal && this.objects.narrativeCrystal.visible) {
            this.objects.narrativeCrystal.rotation.y += 0.01;
            this.objects.narrativeCrystal.children.forEach((child, index) => {
                if (child.type === 'Mesh' && child.geometry.type === 'OctahedronGeometry') {
                    child.rotation.x += 0.005;
                    child.rotation.z += 0.003;
                }
            });
        }
        
        // Opportunity City animations
        if (this.objects.opportunityCity && this.objects.opportunityCity.visible) {
            this.objects.opportunityCity.children.forEach((building, index) => {
                if (building.material && building.material.emissive) {
                    building.material.emissive.setHSL(
                        0.55,
                        0.8,
                        0.1 + Math.sin(time + index) * 0.1
                    );
                }
            });
        }
        
        // Ambient Particles animations
        if (this.objects.ambientParticles) {
            this.objects.ambientParticles.material.uniforms.time.value = time;
            this.objects.ambientParticles.rotation.y += 0.002;
        }
        
        // Energy Field animations
        if (this.objects.energyField) {
            this.objects.energyField.rotation.y += 0.005;
        }
    }

    updateMouseEffects() {
        // Camera subtle movement based on mouse
        if (this.camera) {
            const targetX = this.mouse.x * 5;
            const targetY = this.mouse.y * 5;
            
            this.camera.position.x += (targetX - this.camera.position.x) * 0.02;
            this.camera.position.y += (targetY - this.camera.position.y) * 0.02;
        }
    }

    // Utility Functions
    handleResize() {
        if (!this.camera || !this.renderer) return;
        
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
}

// Global Functions
function startJourney() {
    // Trigger dramatic transition animation
    const megaCta = document.getElementById('final-cta');
    
    gsap.timeline()
        .to(megaCta, {
            scale: 1.2,
            duration: 0.3,
            ease: "power2.out"
        })
        .to(megaCta, {
            scale: 0,
            opacity: 0,
            duration: 0.5,
            ease: "power2.in"
        })
        .call(() => {
            // Here you would typically redirect to registration/onboarding
            alert('Welcome to CareerForge! Your journey begins now.');
            
            // Reset button
            gsap.set(megaCta, { scale: 1, opacity: 1 });
        });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Create main engine instance
    const careerForge = new CareerForgeEngine();
    
    // Make resize handler global
    window.addEventListener('resize', () => careerForge.handleResize());
    
    // Enhanced scroll experience
    const setupEnhancedScroll = () => {
        // Smooth scroll for better UX
        const lenis = {
            scroll: (delta) => {
                window.scrollBy(0, delta * 2);
            }
        };
        
        // Mouse wheel enhancement
        let isScrolling = false;
        document.addEventListener('wheel', (e) => {
            if (!isScrolling) {
                isScrolling = true;
                setTimeout(() => isScrolling = false, 100);
                
                // Add subtle screen shake on scroll
                gsap.to('body', {
                    x: Math.random() * 2 - 1,
                    y: Math.random() * 2 - 1,
                    duration: 0.1,
                    ease: "power2.out",
                    onComplete: () => {
                        gsap.set('body', { x: 0, y: 0 });
                    }
                });
            }
        });
    };
    
    setupEnhancedScroll();
    
    // Add performance monitoring
    const monitorPerformance = () => {
        let fps = 0;
        let lastTime = performance.now();
        
        const countFPS = () => {
            const currentTime = performance.now();
            fps = 1000 / (currentTime - lastTime);
            lastTime = currentTime;
            
            // Reduce quality if FPS drops below 30
            if (fps < 30) {
                document.body.classList.add('low-performance');
            } else {
                document.body.classList.remove('low-performance');
            }
            
            requestAnimationFrame(countFPS);
        };
        
        countFPS();
    };
    
    monitorPerformance();
    
    // Console easter egg
    console.log(`
    ╔═══════════════════════════════════════╗
    ║           Welcome to CareerForge      ║
    ║                                       ║
    ║        🔥 Forge Your Future 🔥        ║
    ║                                       ║
    ║   Built with Three.js, GSAP & ❤️     ║
    ╚═══════════════════════════════════════╝
    `);
});

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CareerForgeEngine, startJourney };
}
