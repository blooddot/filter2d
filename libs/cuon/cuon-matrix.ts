// cuon-matrix.js (c) 2012 kanda and matsuda
/** 
 * This is a class treating 4x4 matrix.
 * This class contains the function that is equivalent to OpenGL matrix stack.
 * The matrix after conversion is calculated by multiplying a conversion matrix from the right.
 * The matrix is replaced by the calculated result.
 */

/**
 * Constructor of Matrix4
 * If opt_src is specified, new matrix is initialized by opt_src.
 * Otherwise, new matrix is initialized by identity matrix.
 * @param opt_src source matrix(option)
 */
export class Matrix4 {
  public elements: Float32Array;
  public constructor(opt_src?: Matrix4) {
    if (opt_src?.elements) {
      const s = opt_src.elements;
      const d = new Float32Array(16);
      for (let i = 0; i < 16; ++i) {
        d[i] = s[i];
      }
      this.elements = d;
    } else {
      this.elements = new Float32Array([
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
      ]);
    }
  }

  /**
   * Set the identity matrix.
   * @return this
   */
  public setIdentity(): Matrix4 {
    const e = this.elements;
    e[0] = 1; e[4] = 0; e[8] = 0; e[12] = 0;
    e[1] = 0; e[5] = 1; e[9] = 0; e[13] = 0;
    e[2] = 0; e[6] = 0; e[10] = 1; e[14] = 0;
    e[3] = 0; e[7] = 0; e[11] = 0; e[15] = 1;
    return this;
  }

  /**
   * Copy matrix.
   * @param src source matrix
   * @return this
   */
  public set(src: Matrix4): Matrix4 {
    const s = src.elements;
    const d = this.elements;

    if (s === d) {
      return;
    }

    for (let i = 0; i < 16; ++i) {
      d[i] = s[i];
    }

    return this;
  }

  /**
 * Multiply the matrix from the right.
 * @param other The multiply matrix
 * @return this
 */
  public concat(other: Matrix4): Matrix4 {
    // Calculate e = a * b
    const e = this.elements;
    const a = this.elements;
    let b = other.elements;

    // If e equals b, copy b to temporary matrix.
    if (e === b) {
      b = new Float32Array(16);
      for (let i = 0; i < 16; ++i) {
        b[i] = e[i];
      }
    }


    let ai0: number, ai1: number, ai2: number, ai3: number;
    for (let i = 0; i < 4; i++) {
      ai0 = a[i]; ai1 = a[i + 4]; ai2 = a[i + 8]; ai3 = a[i + 12];
      e[i] = ai0 * b[0] + ai1 * b[1] + ai2 * b[2] + ai3 * b[3];
      e[i + 4] = ai0 * b[4] + ai1 * b[5] + ai2 * b[6] + ai3 * b[7];
      e[i + 8] = ai0 * b[8] + ai1 * b[9] + ai2 * b[10] + ai3 * b[11];
      e[i + 12] = ai0 * b[12] + ai1 * b[13] + ai2 * b[14] + ai3 * b[15];
    }

    return this;
  }

  public multiply(other: Matrix4): Matrix4 {
    return this.concat(other);
  }

  /**
 * Multiply the three-dimensional vector.
 * @param pos  The multiply vector
 * @return The result of multiplication(Float32Array)
 */
  public multiplyVector3(pos: Matrix4): Vector3 {
    const e = this.elements;
    const p = pos.elements;
    const v = new Vector3();
    const result = v.elements;

    result[0] = p[0] * e[0] + p[1] * e[4] + p[2] * e[8] + e[11];
    result[1] = p[0] * e[1] + p[1] * e[5] + p[2] * e[9] + e[12];
    result[2] = p[0] * e[2] + p[1] * e[6] + p[2] * e[10] + e[13];

    return v;
  }

  /**
   * Multiply the four-dimensional vector.
   * @param pos  The multiply vector
   * @return The result of multiplication(Float32Array)
   */
  public multiplyVector4(pos: Matrix4): Vector4 {
    const e = this.elements;
    const p = pos.elements;
    const v = new Vector4();
    const result = v.elements;

    result[0] = p[0] * e[0] + p[1] * e[4] + p[2] * e[8] + p[3] * e[12];
    result[1] = p[0] * e[1] + p[1] * e[5] + p[2] * e[9] + p[3] * e[13];
    result[2] = p[0] * e[2] + p[1] * e[6] + p[2] * e[10] + p[3] * e[14];
    result[3] = p[0] * e[3] + p[1] * e[7] + p[2] * e[11] + p[3] * e[15];

    return v;
  }

  /**
   * Transpose the matrix.
   * @return this
   */
  public transpose(): Matrix4 {
    const e = this.elements;
    let t: number;

    t = e[1]; e[1] = e[4]; e[4] = t;
    t = e[2]; e[2] = e[8]; e[8] = t;
    t = e[3]; e[3] = e[12]; e[12] = t;
    t = e[6]; e[6] = e[9]; e[9] = t;
    t = e[7]; e[7] = e[13]; e[13] = t;
    t = e[11]; e[11] = e[14]; e[14] = t;

    return this;
  }

  /**
   * Calculate the inverse matrix of specified matrix, and set to this.
   * @param other The source matrix
   * @return this
   */
  public setInverseOf(other: Matrix4): Matrix4 {
    const s = other.elements;
    const d = this.elements;
    const inv = new Float32Array(16);

    inv[0] = s[5] * s[10] * s[15] - s[5] * s[11] * s[14] - s[9] * s[6] * s[15]
      + s[9] * s[7] * s[14] + s[13] * s[6] * s[11] - s[13] * s[7] * s[10];
    inv[4] = - s[4] * s[10] * s[15] + s[4] * s[11] * s[14] + s[8] * s[6] * s[15]
      - s[8] * s[7] * s[14] - s[12] * s[6] * s[11] + s[12] * s[7] * s[10];
    inv[8] = s[4] * s[9] * s[15] - s[4] * s[11] * s[13] - s[8] * s[5] * s[15]
      + s[8] * s[7] * s[13] + s[12] * s[5] * s[11] - s[12] * s[7] * s[9];
    inv[12] = - s[4] * s[9] * s[14] + s[4] * s[10] * s[13] + s[8] * s[5] * s[14]
      - s[8] * s[6] * s[13] - s[12] * s[5] * s[10] + s[12] * s[6] * s[9];

    inv[1] = - s[1] * s[10] * s[15] + s[1] * s[11] * s[14] + s[9] * s[2] * s[15]
      - s[9] * s[3] * s[14] - s[13] * s[2] * s[11] + s[13] * s[3] * s[10];
    inv[5] = s[0] * s[10] * s[15] - s[0] * s[11] * s[14] - s[8] * s[2] * s[15]
      + s[8] * s[3] * s[14] + s[12] * s[2] * s[11] - s[12] * s[3] * s[10];
    inv[9] = - s[0] * s[9] * s[15] + s[0] * s[11] * s[13] + s[8] * s[1] * s[15]
      - s[8] * s[3] * s[13] - s[12] * s[1] * s[11] + s[12] * s[3] * s[9];
    inv[13] = s[0] * s[9] * s[14] - s[0] * s[10] * s[13] - s[8] * s[1] * s[14]
      + s[8] * s[2] * s[13] + s[12] * s[1] * s[10] - s[12] * s[2] * s[9];

    inv[2] = s[1] * s[6] * s[15] - s[1] * s[7] * s[14] - s[5] * s[2] * s[15]
      + s[5] * s[3] * s[14] + s[13] * s[2] * s[7] - s[13] * s[3] * s[6];
    inv[6] = - s[0] * s[6] * s[15] + s[0] * s[7] * s[14] + s[4] * s[2] * s[15]
      - s[4] * s[3] * s[14] - s[12] * s[2] * s[7] + s[12] * s[3] * s[6];
    inv[10] = s[0] * s[5] * s[15] - s[0] * s[7] * s[13] - s[4] * s[1] * s[15]
      + s[4] * s[3] * s[13] + s[12] * s[1] * s[7] - s[12] * s[3] * s[5];
    inv[14] = - s[0] * s[5] * s[14] + s[0] * s[6] * s[13] + s[4] * s[1] * s[14]
      - s[4] * s[2] * s[13] - s[12] * s[1] * s[6] + s[12] * s[2] * s[5];

    inv[3] = - s[1] * s[6] * s[11] + s[1] * s[7] * s[10] + s[5] * s[2] * s[11]
      - s[5] * s[3] * s[10] - s[9] * s[2] * s[7] + s[9] * s[3] * s[6];
    inv[7] = s[0] * s[6] * s[11] - s[0] * s[7] * s[10] - s[4] * s[2] * s[11]
      + s[4] * s[3] * s[10] + s[8] * s[2] * s[7] - s[8] * s[3] * s[6];
    inv[11] = - s[0] * s[5] * s[11] + s[0] * s[7] * s[9] + s[4] * s[1] * s[11]
      - s[4] * s[3] * s[9] - s[8] * s[1] * s[7] + s[8] * s[3] * s[5];
    inv[15] = s[0] * s[5] * s[10] - s[0] * s[6] * s[9] - s[4] * s[1] * s[10]
      + s[4] * s[2] * s[9] + s[8] * s[1] * s[6] - s[8] * s[2] * s[5];

    let det = s[0] * inv[0] + s[1] * inv[4] + s[2] * inv[8] + s[3] * inv[12];
    if (det === 0) {
      return this;
    }

    det = 1 / det;
    for (let i = 0; i < 16; i++) {
      d[i] = inv[i] * det;
    }

    return this;
  }

  /**
   * Calculate the inverse matrix of this, and set to this.
   * @return this
   */
  public invert(): Matrix4 {
    return this.setInverseOf(this);
  }

  /**
   * Set the orthographic projection matrix.
   * @param left The coordinate of the left of clipping plane.
   * @param right The coordinate of the right of clipping plane.
   * @param bottom The coordinate of the bottom of clipping plane.
   * @param top The coordinate of the top top clipping plane.
   * @param near The distances to the nearer depth clipping plane. This value is minus if the plane is to be behind the viewer.
   * @param far The distances to the farther depth clipping plane. This value is minus if the plane is to be behind the viewer.
   * @return this
   */
  public setOrtho(left: number, right: number, bottom: number, top: number, near: number, far: number) {
    if (left === right || bottom === top || near === far) {
      throw new Error('null frustum');
    }

    const rw = 1 / (right - left);
    const rh = 1 / (top - bottom);
    const rd = 1 / (far - near);

    const e = this.elements;

    e[0] = 2 * rw;
    e[1] = 0;
    e[2] = 0;
    e[3] = 0;

    e[4] = 0;
    e[5] = 2 * rh;
    e[6] = 0;
    e[7] = 0;

    e[8] = 0;
    e[9] = 0;
    e[10] = -2 * rd;
    e[11] = 0;

    e[12] = -(right + left) * rw;
    e[13] = -(top + bottom) * rh;
    e[14] = -(far + near) * rd;
    e[15] = 1;

    return this;
  }

  /**
   * Multiply the orthographic projection matrix from the right.
   * @param left The coordinate of the left of clipping plane.
   * @param right The coordinate of the right of clipping plane.
   * @param bottom The coordinate of the bottom of clipping plane.
   * @param top The coordinate of the top top clipping plane.
   * @param near The distances to the nearer depth clipping plane. This value is minus if the plane is to be behind the viewer.
   * @param far The distances to the farther depth clipping plane. This value is minus if the plane is to be behind the viewer.
   * @return this
   */
  public ortho(left: number, right: number, bottom: number, top: number, near: number, far: number): Matrix4 {
    return this.concat(new Matrix4().setOrtho(left, right, bottom, top, near, far));
  }

  /**
   * Set the perspective projection matrix.
   * @param left The coordinate of the left of clipping plane.
   * @param right The coordinate of the right of clipping plane.
   * @param bottom The coordinate of the bottom of clipping plane.
   * @param top The coordinate of the top top clipping plane.
   * @param near The distances to the nearer depth clipping plane. This value must be plus value.
   * @param far The distances to the farther depth clipping plane. This value must be plus value.
   * @return this
   */
  public setFrustum(left: number, right: number, bottom: number, top: number, near: number, far: number): Matrix4 {
    if (left === right || top === bottom || near === far) {
      throw new Error('null frustum');
    }
    if (near <= 0) {
      throw new Error('near <= 0');
    }
    if (far <= 0) {
      throw new Error('far <= 0');
    }

    const rw = 1 / (right - left);
    const rh = 1 / (top - bottom);
    const rd = 1 / (far - near);

    const e = this.elements;

    e[0] = 2 * near * rw;
    e[1] = 0;
    e[2] = 0;
    e[3] = 0;

    e[4] = 0;
    e[5] = 2 * near * rh;
    e[6] = 0;
    e[7] = 0;

    e[8] = (right + left) * rw;
    e[9] = (top + bottom) * rh;
    e[10] = -(far + near) * rd;
    e[11] = -1;

    e[12] = 0;
    e[13] = 0;
    e[14] = -2 * near * far * rd;
    e[15] = 0;

    return this;
  }

  /**
   * Multiply the perspective projection matrix from the right.
   * @param left The coordinate of the left of clipping plane.
   * @param right The coordinate of the right of clipping plane.
   * @param bottom The coordinate of the bottom of clipping plane.
   * @param top The coordinate of the top top clipping plane.
   * @param near The distances to the nearer depth clipping plane. This value must be plus value.
   * @param far The distances to the farther depth clipping plane. This value must be plus value.
   * @return this
   */
  public frustum(left: number, right: number, bottom: number, top: number, near: number, far: number): Matrix4 {
    return this.concat(new Matrix4().setFrustum(left, right, bottom, top, near, far));
  }

  /**
   * Set the perspective projection matrix by fovy and aspect.
   * @param fovy The angle between the upper and lower sides of the frustum.
   * @param aspect The aspect ratio of the frustum. (width/height)
   * @param near The distances to the nearer depth clipping plane. This value must be plus value.
   * @param far The distances to the farther depth clipping plane. This value must be plus value.
   * @return this
   */
  public setPerspective(fovy: number, aspect: number, near: number, far: number): Matrix4 {
    if (near === far || aspect === 0) {
      throw new Error('null frustum');
    }
    if (near <= 0) {
      throw new Error('near <= 0');
    }
    if (far <= 0) {
      throw new Error('far <= 0');
    }

    fovy = Math.PI * fovy / 180 / 2;
    const s = Math.sin(fovy);
    if (s === 0) {
      throw new Error('null frustum');
    }

    const rd = 1 / (far - near);
    const ct = Math.cos(fovy) / s;

    const e = this.elements;

    e[0] = ct / aspect;
    e[1] = 0;
    e[2] = 0;
    e[3] = 0;

    e[4] = 0;
    e[5] = ct;
    e[6] = 0;
    e[7] = 0;

    e[8] = 0;
    e[9] = 0;
    e[10] = -(far + near) * rd;
    e[11] = -1;

    e[12] = 0;
    e[13] = 0;
    e[14] = -2 * near * far * rd;
    e[15] = 0;

    return this;
  }

  /**
   * Multiply the perspective projection matrix from the right.
   * @param fovy The angle between the upper and lower sides of the frustum.
   * @param aspect The aspect ratio of the frustum. (width/height)
   * @param near The distances to the nearer depth clipping plane. This value must be plus value.
   * @param far The distances to the farther depth clipping plane. This value must be plus value.
   * @return this
   */
  public perspective(fovy, aspect, near, far) {
    return this.concat(new Matrix4().setPerspective(fovy, aspect, near, far));
  }

  /**
   * Set the matrix for scaling.
   * @param x The scale factor along the X axis
   * @param y The scale factor along the Y axis
   * @param z The scale factor along the Z axis
   * @return this
   */
  public setScale(x: number, y: number, z: number): Matrix4 {
    const e = this.elements;
    e[0] = x; e[4] = 0; e[8] = 0; e[12] = 0;
    e[1] = 0; e[5] = y; e[9] = 0; e[13] = 0;
    e[2] = 0; e[6] = 0; e[10] = z; e[14] = 0;
    e[3] = 0; e[7] = 0; e[11] = 0; e[15] = 1;
    return this;
  }

  /**
   * Multiply the matrix for scaling from the right.
   * @param x The scale factor along the X axis
   * @param y The scale factor along the Y axis
   * @param z The scale factor along the Z axis
   * @return this
   */
  public scale(x: number, y: number, z: number): Matrix4 {
    const e = this.elements;
    e[0] *= x; e[4] *= y; e[8] *= z;
    e[1] *= x; e[5] *= y; e[9] *= z;
    e[2] *= x; e[6] *= y; e[10] *= z;
    e[3] *= x; e[7] *= y; e[11] *= z;
    return this;
  }

  /**
   * Set the matrix for translation.
   * @param x The X value of a translation.
   * @param y The Y value of a translation.
   * @param z The Z value of a translation.
   * @return this
   */
  public setTranslate(x: number, y: number, z: number): Matrix4 {
    const e = this.elements;
    e[0] = 1; e[4] = 0; e[8] = 0; e[12] = x;
    e[1] = 0; e[5] = 1; e[9] = 0; e[13] = y;
    e[2] = 0; e[6] = 0; e[10] = 1; e[14] = z;
    e[3] = 0; e[7] = 0; e[11] = 0; e[15] = 1;
    return this;
  }

  /**
   * Multiply the matrix for translation from the right.
   * @param x The X value of a translation.
   * @param y The Y value of a translation.
   * @param z The Z value of a translation.
   * @return this
   */
  public translate(x: number, y: number, z: number): Matrix4 {
    const e = this.elements;
    e[12] += e[0] * x + e[4] * y + e[8] * z;
    e[13] += e[1] * x + e[5] * y + e[9] * z;
    e[14] += e[2] * x + e[6] * y + e[10] * z;
    e[15] += e[3] * x + e[7] * y + e[11] * z;
    return this;
  }

  /**
   * Set the matrix for rotation.
   * The vector of rotation axis may not be normalized.
   * @param angle The angle of rotation (degrees)
   * @param x The X coordinate of vector of rotation axis.
   * @param y The Y coordinate of vector of rotation axis.
   * @param z The Z coordinate of vector of rotation axis.
   * @return this
   */
  public setRotate(angle: number, x: number, y: number, z: number): Matrix4 {
    // var e, s, c, len, rlen, nc, xy, yz, zx, xs, ys, zs;

    angle = Math.PI * angle / 180;
    const e = this.elements;

    let s = Math.sin(angle);
    const c = Math.cos(angle);

    if (0 !== x && 0 === y && 0 === z) {
      // Rotation around X axis
      if (x < 0) {
        s = -s;
      }
      e[0] = 1; e[4] = 0; e[8] = 0; e[12] = 0;
      e[1] = 0; e[5] = c; e[9] = -s; e[13] = 0;
      e[2] = 0; e[6] = s; e[10] = c; e[14] = 0;
      e[3] = 0; e[7] = 0; e[11] = 0; e[15] = 1;
    } else if (0 === x && 0 !== y && 0 === z) {
      // Rotation around Y axis
      if (y < 0) {
        s = -s;
      }
      e[0] = c; e[4] = 0; e[8] = s; e[12] = 0;
      e[1] = 0; e[5] = 1; e[9] = 0; e[13] = 0;
      e[2] = -s; e[6] = 0; e[10] = c; e[14] = 0;
      e[3] = 0; e[7] = 0; e[11] = 0; e[15] = 1;
    } else if (0 === x && 0 === y && 0 !== z) {
      // Rotation around Z axis
      if (z < 0) {
        s = -s;
      }
      e[0] = c; e[4] = -s; e[8] = 0; e[12] = 0;
      e[1] = s; e[5] = c; e[9] = 0; e[13] = 0;
      e[2] = 0; e[6] = 0; e[10] = 1; e[14] = 0;
      e[3] = 0; e[7] = 0; e[11] = 0; e[15] = 1;
    } else {
      // Rotation around another axis
      const len = Math.sqrt(x * x + y * y + z * z);
      if (len !== 1) {
        const rlen = 1 / len;
        x *= rlen;
        y *= rlen;
        z *= rlen;
      }
      const nc = 1 - c;
      const xy = x * y;
      const yz = y * z;
      const zx = z * x;
      const xs = x * s;
      const ys = y * s;
      const zs = z * s;

      e[0] = x * x * nc + c;
      e[1] = xy * nc + zs;
      e[2] = zx * nc - ys;
      e[3] = 0;

      e[4] = xy * nc - zs;
      e[5] = y * y * nc + c;
      e[6] = yz * nc + xs;
      e[7] = 0;

      e[8] = zx * nc + ys;
      e[9] = yz * nc - xs;
      e[10] = z * z * nc + c;
      e[11] = 0;

      e[12] = 0;
      e[13] = 0;
      e[14] = 0;
      e[15] = 1;
    }

    return this;
  }

  /**
   * Multiply the matrix for rotation from the right.
   * The vector of rotation axis may not be normalized.
   * @param angle The angle of rotation (degrees)
   * @param x The X coordinate of vector of rotation axis.
   * @param y The Y coordinate of vector of rotation axis.
   * @param z The Z coordinate of vector of rotation axis.
   * @return this
   */
  public rotate(angle: number, x: number, y: number, z: number): Matrix4 {
    return this.concat(new Matrix4().setRotate(angle, x, y, z));
  }

  /**
   * Set the viewing matrix.
   * @param eyeX, eyeY, eyeZ The position of the eye point.
   * @param centerX, centerY, centerZ The position of the reference point.
   * @param upX, upY, upZ The direction of the up vector.
   * @return this
   */
  // eslint-disable-next-line max-params
  public setLookAt(eyeX: number, eyeY: number, eyeZ: number, centerX: number, centerY: number, centerZ: number, upX: number, upY: number, upZ: number): Matrix4 {
    let fx = centerX - eyeX;
    let fy = centerY - eyeY;
    let fz = centerZ - eyeZ;

    // Normalize f.
    const rlf = 1 / Math.sqrt(fx * fx + fy * fy + fz * fz);
    fx *= rlf;
    fy *= rlf;
    fz *= rlf;

    // Calculate cross product of f and up.
    let sx = fy * upZ - fz * upY;
    let sy = fz * upX - fx * upZ;
    let sz = fx * upY - fy * upX;

    // Normalize s.
    const rls = 1 / Math.sqrt(sx * sx + sy * sy + sz * sz);
    sx *= rls;
    sy *= rls;
    sz *= rls;

    // Calculate cross product of s and f.
    const ux = sy * fz - sz * fy;
    const uy = sz * fx - sx * fz;
    const uz = sx * fy - sy * fx;

    // Set to this.
    const e = this.elements;
    e[0] = sx;
    e[1] = ux;
    e[2] = -fx;
    e[3] = 0;

    e[4] = sy;
    e[5] = uy;
    e[6] = -fy;
    e[7] = 0;

    e[8] = sz;
    e[9] = uz;
    e[10] = -fz;
    e[11] = 0;

    e[12] = 0;
    e[13] = 0;
    e[14] = 0;
    e[15] = 1;

    // Translate.
    return this.translate(-eyeX, -eyeY, -eyeZ);
  }

  /**
   * Multiply the viewing matrix from the right.
   * @param eyeX, eyeY, eyeZ The position of the eye point.
   * @param centerX, centerY, centerZ The position of the reference point.
   * @param upX, upY, upZ The direction of the up vector.
   * @return this
   */
  // eslint-disable-next-line max-params
  public lookAt(eyeX: number, eyeY: number, eyeZ: number, centerX: number, centerY: number, centerZ: number, upX: number, upY: number, upZ: number): Matrix4 {
    return this.concat(new Matrix4().setLookAt(eyeX, eyeY, eyeZ, centerX, centerY, centerZ, upX, upY, upZ));
  }

  /**
   * Multiply the matrix for project vertex to plane from the right.
   * @param plane The array[A, B, C, D] of the equation of plane "Ax + By + Cz + D = 0".
   * @param light The array which stored coordinates of the light. if light[3]=0, treated as parallel light.
   * @return this
   */
  public dropShadow(plane: number[], light: number[]): Matrix4 {
    const mat = new Matrix4();
    const e = mat.elements;

    const dot = plane[0] * light[0] + plane[1] * light[1] + plane[2] * light[2] + plane[3] * light[3];

    e[0] = dot - light[0] * plane[0];
    e[1] = - light[1] * plane[0];
    e[2] = - light[2] * plane[0];
    e[3] = - light[3] * plane[0];

    e[4] = - light[0] * plane[1];
    e[5] = dot - light[1] * plane[1];
    e[6] = - light[2] * plane[1];
    e[7] = - light[3] * plane[1];

    e[8] = - light[0] * plane[2];
    e[9] = - light[1] * plane[2];
    e[10] = dot - light[2] * plane[2];
    e[11] = - light[3] * plane[2];

    e[12] = - light[0] * plane[3];
    e[13] = - light[1] * plane[3];
    e[14] = - light[2] * plane[3];
    e[15] = dot - light[3] * plane[3];

    return this.concat(mat);
  }

  /**
   * Multiply the matrix for project vertex to plane from the right.(Projected by parallel light.)
   * @param normX, normY, normZ The normal vector of the plane.(Not necessary to be normalized.)
   * @param planeX, planeY, planeZ The coordinate of arbitrary points on a plane.
   * @param lightX, lightY, lightZ The vector of the direction of light.(Not necessary to be normalized.)
   * @return this
   */
  // eslint-disable-next-line max-params
  public dropShadowDirectionally(normX: number, normY: number, normZ: number, planeX: number, planeY: number, planeZ: number, lightX: number, lightY: number, lightZ: number): Matrix4 {
    const a = planeX * normX + planeY * normY + planeZ * normZ;
    return this.dropShadow([normX, normY, normZ, -a], [lightX, lightY, lightZ, 0]);
  }
}

/**
 * Constructor of Vector3
 * If opt_src is specified, new vector is initialized by opt_src.
 * @param opt_src source vector(option)
 */
export class Vector3 {
  public elements: Float32Array;

  public constructor(opt_src?: [number, number, number]) {
    const v = new Float32Array(3);
    if (opt_src) {
      v[0] = opt_src[0]; v[1] = opt_src[1]; v[2] = opt_src[2];
    }
    this.elements = v;
  }

  /**
  * Normalize.
  * @return this
  */
  public normalize(): Vector3 {
    const v = this.elements;
    const c = v[0]; const d = v[1]; const e = v[2];
    let g = Math.sqrt(c * c + d * d + e * e);

    if (!g) {
      v[0] = 0; v[1] = 0; v[2] = 0;
      return this;
    }

    if (g === 1) return this;

    g = 1 / g;
    v[0] = c * g; v[1] = d * g; v[2] = e * g;
    return this;
  }
}

/**
 * Constructor of Vector4
 * If opt_src is specified, new vector is initialized by opt_src.
 * @param opt_src source vector(option)
 */
class Vector4 {
  public elements: Float32Array;

  public constructor(opt_src?: Float32Array) {
    const v = new Float32Array(4);
    if (opt_src) {
      v[0] = opt_src[0]; v[1] = opt_src[1]; v[2] = opt_src[2]; v[3] = opt_src[3];
    }
    this.elements = v;
  }
}