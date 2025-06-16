// Inisialisasi matriks
function createMatrix(rows, cols, matrixId) {
    const matrix = document.getElementById(matrixId);
    matrix.innerHTML = '';
    matrix.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
    
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            const input = document.createElement('input');
            input.type = 'number';
            input.value = '0';
            input.step = '0.01';
            input.dataset.row = i;
            input.dataset.col = j;
            matrix.appendChild(input);
        }
    }
}

// Mendapatkan nilai matriks dari input
function getMatrixValues(matrixId) {
    const inputs = document.querySelectorAll(`#${matrixId} input`);
    const rows = parseInt(document.getElementById(matrixId === 'matrixA' ? 'rowsA' : 'rowsB').value);
    const cols = parseInt(document.getElementById(matrixId === 'matrixA' ? 'colsA' : 'colsB').value);
    
    const matrix = [];
    for (let i = 0; i < rows; i++) {
        matrix[i] = [];
        for (let j = 0; j < cols; j++) {
            const input = inputs[i * cols + j];
            matrix[i][j] = parseFloat(input.value) || 0;
        }
    }
    return matrix;
}

// Menampilkan hasil matriks
function displayMatrix(matrix, containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';
    
    if (!matrix || matrix.length === 0) {
        container.innerHTML = '<div class="error">Matriks tidak valid</div>';
        return;
    }
    
    const resultDiv = document.createElement('div');
    resultDiv.className = 'result-matrix';
    resultDiv.style.gridTemplateColumns = `repeat(${matrix[0].length}, 1fr)`;
    
    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix[0].length; j++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.textContent = matrix[i][j].toFixed(2);
            resultDiv.appendChild(cell);
        }
    }
    
    container.appendChild(resultDiv);
}

// Menampilkan hasil skalar
function displayScalar(value, containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = `<div class="scalar-result">${value.toFixed(4)}</div>`;
}

// Operasi matriks
function addMatrices(a, b) {
    if (a.length !== b.length || a[0].length !== b[0].length) {
        throw new Error('Matriks harus memiliki ukuran yang sama untuk penjumlahan');
    }
    
    const result = [];
    for (let i = 0; i < a.length; i++) {
        result[i] = [];
        for (let j = 0; j < a[0].length; j++) {
            result[i][j] = a[i][j] + b[i][j];
        }
    }
    return result;
}

function subtractMatrices(a, b) {
    if (a.length !== b.length || a[0].length !== b[0].length) {
        throw new Error('Matriks harus memiliki ukuran yang sama untuk pengurangan');
    }
    
    const result = [];
    for (let i = 0; i < a.length; i++) {
        result[i] = [];
        for (let j = 0; j < a[0].length; j++) {
            result[i][j] = a[i][j] - b[i][j];
        }
    }
    return result;
}

function multiplyMatrices(a, b) {
    if (a[0].length !== b.length) {
        throw new Error('Jumlah kolom matriks A harus sama dengan jumlah baris matriks B');
    }
    
    const result = [];
    for (let i = 0; i < a.length; i++) {
        result[i] = [];
        for (let j = 0; j < b[0].length; j++) {
            result[i][j] = 0;
            for (let k = 0; k < a[0].length; k++) {
                result[i][j] += a[i][k] * b[k][j];
            }
        }
    }
    return result;
}

function transposeMatrix(matrix) {
    const result = [];
    for (let i = 0; i < matrix[0].length; i++) {
        result[i] = [];
        for (let j = 0; j < matrix.length; j++) {
            result[i][j] = matrix[j][i];
        }
    }
    return result;
}

function determinant(matrix) {
    if (matrix.length !== matrix[0].length) {
        throw new Error('Determinan hanya dapat dihitung untuk matriks persegi');
    }
    
    const n = matrix.length;
    
    if (n === 1) return matrix[0][0];
    if (n === 2) return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
    
    let det = 0;
    for (let i = 0; i < n; i++) {
        const minor = [];
        for (let j = 1; j < n; j++) {
            const row = [];
            for (let k = 0; k < n; k++) {
                if (k !== i) row.push(matrix[j][k]);
            }
            minor.push(row);
        }
        det += (i % 2 === 0 ? 1 : -1) * matrix[0][i] * determinant(minor);
    }
    return det;
}

function inverse(matrix) {
    if (matrix.length !== matrix[0].length) {
        throw new Error('Invers hanya dapat dihitung untuk matriks persegi');
    }
    
    const det = determinant(matrix);
    if (Math.abs(det) < 1e-10) {
        throw new Error('Matriks singular, tidak memiliki invers');
    }
    
    const n = matrix.length;
    const adjugate = [];
    
    for (let i = 0; i < n; i++) {
        adjugate[i] = [];
        for (let j = 0; j < n; j++) {
            const minor = [];
            for (let k = 0; k < n; k++) {
                if (k !== i) {
                    const row = [];
                    for (let l = 0; l < n; l++) {
                        if (l !== j) row.push(matrix[k][l]);
                    }
                    minor.push(row);
                }
            }
            const cofactor = ((i + j) % 2 === 0 ? 1 : -1) * determinant(minor);
            adjugate[i][j] = cofactor / det;
        }
    }
    
    return transposeMatrix(adjugate);
}

// Operasi utama
function performOperation(operation) {
    try {
        const matrixA = getMatrixValues('matrixA');
        const matrixB = getMatrixValues('matrixB');
        
        let result;
        switch (operation) {
            case 'add':
                result = addMatrices(matrixA, matrixB);
                displayMatrix(result, 'result');
                break;
            case 'subtract':
                result = subtractMatrices(matrixA, matrixB);
                displayMatrix(result, 'result');
                break;
            case 'multiply':
                result = multiplyMatrices(matrixA, matrixB);
                displayMatrix(result, 'result');
                break;
            case 'transpose_a':
                result = transposeMatrix(matrixA);
                displayMatrix(result, 'result');
                break;
            case 'transpose_b':
                result = transposeMatrix(matrixB);
                displayMatrix(result, 'result');
                break;
            case 'determinant_a':
                result = determinant(matrixA);
                displayScalar(result, 'result');
                break;
            case 'determinant_b':
                result = determinant(matrixB);
                displayScalar(result, 'result');
                break;
            case 'inverse_a':
                result = inverse(matrixA);
                displayMatrix(result, 'result');
                break;
            case 'inverse_b':
                result = inverse(matrixB);
                displayMatrix(result, 'result');
                break;
        }
    } catch (error) {
        document.getElementById('result').innerHTML = `<div class="error">${error.message}</div>`;
    }
}

// Fungsi bantuan
function randomFill(matrix) {
    const matrixId = `matrix${matrix}`;
    const inputs = document.querySelectorAll(`#${matrixId} input`);
    inputs.forEach(input => {
        input.value = Math.floor(Math.random() * 10) - 5;
    });
}

function clearMatrix(matrix) {
    const matrixId = `matrix${matrix}`;
    const inputs = document.querySelectorAll(`#${matrixId} input`);
    inputs.forEach(input => {
        input.value = '0';
    });
}

function identityMatrix(matrix) {
    const matrixId = `matrix${matrix}`;
    const rows = parseInt(document.getElementById(matrix === 'A' ? 'rowsA' : 'rowsB').value);
    const cols = parseInt(document.getElementById(matrix === 'A' ? 'colsA' : 'colsB').value);
    
    if (rows !== cols) {
        alert('Matriks identitas harus berukuran persegi');
        return;
    }
    
    const inputs = document.querySelectorAll(`#${matrixId} input`);
    inputs.forEach((input, index) => {
        const row = Math.floor(index / cols);
        const col = index % cols;
        input.value = row === col ? '1' : '0';
    });
}

// Event listeners untuk perubahan ukuran
document.getElementById('rowsA').addEventListener('change', () => {
    const rows = parseInt(document.getElementById('rowsA').value);
    const cols = parseInt(document.getElementById('colsA').value);
    createMatrix(rows, cols, 'matrixA');
});

document.getElementById('colsA').addEventListener('change', () => {
    const rows = parseInt(document.getElementById('rowsA').value);
    const cols = parseInt(document.getElementById('colsA').value);
    createMatrix(rows, cols, 'matrixA');
});

document.getElementById('rowsB').addEventListener('change', () => {
    const rows = parseInt(document.getElementById('rowsB').value);
    const cols = parseInt(document.getElementById('colsB').value);
    createMatrix(rows, cols, 'matrixB');
});

document.getElementById('colsB').addEventListener('change', () => {
    const rows = parseInt(document.getElementById('rowsB').value);
    const cols = parseInt(document.getElementById('colsB').value);
    createMatrix(rows, cols, 'matrixB');
});

// Inisialisasi awal
document.addEventListener('DOMContentLoaded', () => {
    createMatrix(3, 3, 'matrixA');
    createMatrix(3, 3, 'matrixB');
});
