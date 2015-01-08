﻿module SpriteGL {

	export class Shader {
		glProgram: WebGLProgram;
		VertexPosAttribute: number;
		TexCoordAttribute: number;
		private TexSampleUniform: WebGLUniformLocation;
        private MatUniform: WebGLUniformLocation;
        private gl: WebGLRenderingContext = null;

        constructor(gl: WebGLRenderingContext) {
            this.gl = gl;
            this.glProgram = this.MakeProgram(gl);
			this.VertexPosAttribute = gl.getAttribLocation(this.glProgram, "aVertexPosition");
			this.TexCoordAttribute = gl.getAttribLocation(this.glProgram, "aTexCoord");
            this.TexSampleUniform = gl.getUniformLocation(this.glProgram, "sampler2d");
            this.MatUniform = gl.getUniformLocation(this.glProgram, "uProjectionView");

		}

        public UseProgram() {
            this.gl.useProgram(this.glProgram);
            this.gl.uniform1i(this.TexSampleUniform, 0);
        }

		private MakeProgram(gl: WebGLRenderingContext): WebGLProgram {
			var vertexShader = this.CompileShader(gl, Shader.defaultVertexShaderSrc, gl.VERTEX_SHADER);
			var fragmentShader = this.CompileShader(gl, Shader.defaultFragmentShaderSrc, gl.FRAGMENT_SHADER);

			var glProgram = gl.createProgram();
			gl.attachShader(glProgram, vertexShader);
			gl.attachShader(glProgram, fragmentShader);
			gl.linkProgram(glProgram);

			return glProgram;
		}

		private CompileShader(gl: WebGLRenderingContext, src: string, type) {
			var Shader = gl.createShader(type);
			gl.shaderSource(Shader, src);
			gl.compileShader(Shader);

			if (!gl.getShaderParameter(Shader, gl.COMPILE_STATUS)) {
				alert(gl.getShaderInfoLog(Shader));
			}
			return Shader;
        }

        public updateMatrix(mat: TSM.mat4) {
            this.gl.uniformMatrix4fv(this.MatUniform, false, mat.all());
        }

		private static defaultVertexShaderSrc = [
			"attribute vec2 aVertexPosition;",
            "attribute vec2 aTexCoord;",
            "uniform mat4 uProjectionView;",
			"varying vec2 vtexCoord;",
			"void main(void) {",
			"	vtexCoord = aTexCoord;",
			"	gl_Position = vec4(aVertexPosition, 0.0, 1.0)* uProjectionView;",
			"}"].join("\n");

		private static defaultFragmentShaderSrc = [
			"precision mediump float;",
			"uniform sampler2D sampler2d;",
			"varying vec2 vtexCoord;",
			"void main(void) {",
            "	gl_FragColor = texture2D(sampler2d, vec2(vtexCoord.s,vtexCoord.t));",
            "   if(gl_FragColor.a < 0.5) discard;",
			"}"].join("\n");
	}
}
