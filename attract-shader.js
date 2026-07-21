// Light, low-key "cashmere mist" backdrop for the welcome screen — a slow
// flowing warm-cream haze behind the type, matching the app's light theme.
// WebGL fragment shader; self-tears-down when its canvas leaves the DOM.
// Falls back to nothing (the page's own cream ground shows) if WebGL is
// unavailable. See docs/superpowers/specs for the attract-screen feature.
(function () {
    var _raf = null;

    var VERT = "attribute vec2 a;void main(){gl_Position=vec4(a,0.0,1.0);}";
    var FRAG = [
        "precision highp float;",
        "uniform vec2 u_res; uniform float u_time;",
        "float hash(vec2 p){p=fract(p*vec2(123.34,345.45));p+=dot(p,p+34.345);return fract(p.x*p.y);}",
        "float noise(vec2 p){vec2 i=floor(p),f=fract(p);vec2 u=f*f*(3.0-2.0*f);",
        " float a=hash(i),b=hash(i+vec2(1,0)),c=hash(i+vec2(0,1)),d=hash(i+vec2(1,1));",
        " return mix(mix(a,b,u.x),mix(c,d,u.x),u.y);}",
        "float fbm(vec2 p){float s=0.0,a=0.5;for(int i=0;i<5;i++){s+=a*noise(p);p*=2.02;a*=0.5;}return s;}",
        "void main(){",
        " vec2 uv=gl_FragCoord.xy/u_res.xy; float asp=u_res.x/u_res.y;",
        " vec2 p=vec2(uv.x*asp,uv.y)*2.0; float t=u_time*0.032;",
        " vec2 q=vec2(fbm(p+vec2(0.0,t)),fbm(p+vec2(5.2,-t)));",
        " vec2 r=vec2(fbm(p+3.0*q+vec2(1.7,t*0.7)),fbm(p+3.0*q+vec2(8.3,-t*0.6)));",
        " float f=fbm(p+2.5*r);",
        // Warm cream drifting into a soft greige — kept very close in value so
        // it whispers behind the dark type rather than competing with it.
        " vec3 base=vec3(0.960,0.941,0.902);",
        " vec3 shade=vec3(0.874,0.836,0.767);",
        " vec3 col=mix(base, shade, smoothstep(0.30,0.98,f)*0.55);",
        " gl_FragColor=vec4(col,1.0);}"
    ].join("\n");

    function compile(gl, type, src) {
        var s = gl.createShader(type);
        gl.shaderSource(s, src); gl.compileShader(s);
        if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) return null;
        return s;
    }

    window.startAttractShader = function (canvasId) {
        if (_raf) { cancelAnimationFrame(_raf); _raf = null; }
        var cv = document.getElementById(canvasId);
        if (!cv || !cv.getContext) return;
        var gl = cv.getContext("webgl") || cv.getContext("experimental-webgl");
        if (!gl) return; // no WebGL → the page's cream ground shows through

        var vs = compile(gl, gl.VERTEX_SHADER, VERT);
        var fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
        if (!vs || !fs) return;
        var prog = gl.createProgram();
        gl.attachShader(prog, vs); gl.attachShader(prog, fs);
        gl.linkProgram(prog);
        if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
        gl.useProgram(prog);

        var buf = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buf);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
        var loc = gl.getAttribLocation(prog, "a");
        gl.enableVertexAttribArray(loc);
        gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

        var uRes = gl.getUniformLocation(prog, "u_res");
        var uTime = gl.getUniformLocation(prog, "u_time");
        var reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        function size() {
            var r = cv.getBoundingClientRect();
            if (!r.width || !r.height) return false;
            var dpr = Math.min(window.devicePixelRatio || 1, 1.75);
            var w = Math.round(r.width * dpr), h = Math.round(r.height * dpr);
            if (cv.width !== w || cv.height !== h) { cv.width = w; cv.height = h; }
            gl.viewport(0, 0, cv.width, cv.height);
            gl.uniform2f(uRes, cv.width, cv.height);
            return true;
        }
        if (!size()) return;
        window.addEventListener("resize", function () { if (cv.isConnected) size(); }, { passive: true });

        var start = performance.now();
        function frame(now) {
            // The canvas is detached when the view changes — stop drawing.
            if (!cv.isConnected) { _raf = null; return; }
            gl.uniform1f(uTime, reduced ? 12.0 : (now - start) / 1000);
            gl.drawArrays(gl.TRIANGLES, 0, 3);
            if (reduced) { _raf = null; return; }
            _raf = requestAnimationFrame(frame);
        }
        _raf = requestAnimationFrame(frame);
    };
})();
