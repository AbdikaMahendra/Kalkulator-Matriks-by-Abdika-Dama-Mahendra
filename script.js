// Variabel global untuk menyimpan matriks
let matrixA = [];
let matrixB = [];

// Inisialisasi aplikasi
document.addEventListener('DOMContentLoaded', function() {
    generateMatrices();
    
    // Event listeners untuk input dimensi
    document.getElementById('rowsA').addEventListener('change', generateMatrices);
    document.getElementById('colsA').addEventListener('change', generateMatrices);
    document.getElementById('rowsB').addEventListener('change', generateMatrices);
    document.getElementById('colsB').addEventListener('change', generateMatrices);
});

// Fungsi untuk membuat matriks input
function generateMatrices() {
    const rowsA = parseInt(document.getElementById('rowsA').value);
    const colsA = parseInt(document.getElementById('colsA').value);
    const rowsB = parseInt(document.getElementById('rowsB').value);
    const colsB = parseInt(document.getElementById('colsB').value);
    
    // Validasi input
    if (rowsA < 1 || colsA < 1 || rowsB < 1 || colsB < 1) {
        showMessage('Dimensi matriks harus minimal 1x1', 'error');
        return;
    }
    
    if (rowsA > 5 || colsA > 5 || rowsB > 5 || colsB > 5) {
        showMessage('Dimensi matriks maksimal 5x5', 'error');
        return;
    }
    
    createMatrixInputs('matrixA', rowsA, colsA);
    createMatrixInputs('matrixB', rowsB, colsB);
    
    // Reset hasil
    document.getElementById('result').innerHTML = '';
    document.getElementById('resultMatrix').innerHTML = '';
}

// Fungsi untuk membuat input matriks
function createMatrixInputs(containerId, rows, cols) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';
    container.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
    
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            const input = document.createElement('input');
            input.type = 'number';
            input.className = 'matrix-input';
            input.placeholder = '0';
            input.value = '0';
            input.id = `${containerId}_${i}_${j}`;
            container.appendChild(input);
        }
    }
}

// Fungsi untuk mengisi matriks dengan nilai random
function fillRandom(matrix) {
    const rows = matrix === 'A' ? parseInt(document.getElementById('rowsA').value) : parseInt(document.getElementById('rowsB').value);
    const cols = matrix === 'A' ? parseInt(document.getElementById('colsA').value) : parseInt(document.getElementById('colsB').value);
    const containerId = matrix === 'A' ? 'matrixA' : 'matrixB';
    
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            const input = document.getElementById(`${containerId}_${i}_${j}`);
            input.value = Math.floor(Math.random() * 10) + 1;
        }
    }
    
    showMessage(`Matriks ${matrix} telah diisi dengan nilai random`, 'success');
}

// Fungsi untuk mengosongkan matriks
function clearMatrix(matrix) {
    const rows = matrix === 'A' ? parseInt(document.getElementById('rowsA').value) : parseInt(document.getElementById('rowsB').value);
    const cols = matrix === 'A' ? parseInt(document.getElementById('colsA').value) : parseInt(document.getElementById('colsB').value);
    const containerId = matrix === 'A' ? 'matrixA' : 'matrixB';
    
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            const input = document.getElementById(`${containerId}_${i}_${j}`);
            input.value = '0';
        }
    }
    
    showMessage(`Matriks ${matrix} telah dikosongkan`, 'success');
}

// Fungsi untuk mendapatkan nilai matriks dari input
function getMatrixValues(containerId, rows, cols) {
    const matrix = [];
    for (let i = 0; i < rows; i++) {
        matrix[i] = [];
        for (let j = 0; j < cols; j++) {
            const input = document.getElementById(`${containerId}_${i}_${j}`);
            matrix[i][j] = parseFloat(input.value) || 0;
        }
    }
    return matrix;
}

// Fungsi untuk menampilkan hasil matriks
function displayResultMatrix(matrix, operation) {
    const resultContainer = document.getElementById('resultMatrix');
    resultContainer.innerHTML = '';
    
    if (!matrix || matrix.length === 0) {
        document.getElementById('result').innerHTML = '<div class="error">Tidak ada hasil untuk ditampilkan</div>';
        return;
    }
    
    const rows = matrix.length;
    const cols = matrix[0].length;
    
    resultContainer.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
    
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            const input = document.createElement('input');
            input.type = 'text';
            input.className = 'result-matrix-input';
            input.value = matrix[i][j].toFixed(2);
            input.readOnly = true;
            resultContainer.appendChild(input);
        }
    }
    
    document.getElementById('result').innerHTML = `
        <div class="success">
            ✅ Operasi ${operation} berhasil! Hasil matriks ${rows}×${cols}
        </div>
    `;
}

// Fungsi untuk menghitung hasil operasi
function calculateResult() {
    const operation = document.getElementById('operation').value;
    const rowsA = parseInt(document.getElementById('rowsA').value);
    const colsA = parseInt(document.getElementById('colsA').value);
    const rowsB = parseInt(document.getElementById('rowsB').value);
    const colsB = parseInt(document.getElementById('colsB').value);
    
    // Dapatkan nilai matriks
    matrixA = getMatrixValues('matrixA', rowsA, colsA);
    matrixB = getMatrixValues('matrixB', rowsB, colsB);
    
    let result;
    let operationName;
    
    try {
        switch (operation) {
            case 'add':
                if (rowsA !== rowsB || colsA !== colsB) {
                    throw new Error('Untuk penjumlahan, kedua matriks harus memiliki dimensi yang sama');
                }
                result = addMatrices(matrixA, matrixB);
                operationName = 'Penjumlahan (A + B)';
                break;
                
            case 'subtract':
                if (rowsA !== rowsB || colsA !== colsB) {
                    throw new Error('Untuk pengurangan, kedua matriks harus memiliki dimensi yang sama');
                }
                result = subtractMatrices(matrixA, matrixB);
                operationName = 'Pengurangan (A - B)';
                break;
                
            case 'multiply':
                if (colsA !== rowsB) {
                    throw new Error('Untuk perkalian, jumlah kolom A harus sama dengan jumlah baris B');
                }
                result = multiplyMatrices(matrixA, matrixB);
                operationName = 'Perkalian (A × B)';
                break;
                
            case 'transposeA':
                result = transposeMatrix(matrixA);
                operationName = 'Transpose Matriks A';
                break;
                
            case 'transposeB':
                result = transposeMatrix(matrixB);
                operationName = 'Transpose Matriks B';
                break;
                
            default:
                throw new Error('Operasi tidak dikenali');
        }
        
        displayResultMatrix(result, operationName);
        
    } catch (error) {
        showMessage(error.message, 'error');
    }
}

// Fungsi operasi matriks
function addMatrices(a, b) {
    const result = [];
    for (let i = 0; i < a.length; i++) {
        result[i] = [];
        for (let j = 0; j < a[i].length; j++) {
            result[i][j] = a[i][j] + b[i][j];
        }
    }
    return result;
}

function subtractMatrices(a, b) {
    const result = [];
    for (let i = 0; i < a.length; i++) {
        result[i] = [];
        for (let j = 0; j < a[i].length; j++) {
            result[i][j] = a[i][j] - b[i][j];
        }
    }
    return result;
}

function multiplyMatrices(a, b) {
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
    for (let j = 0; j < matrix[0].length; j++) {
        result[j] = [];
        for (let i = 0; i < matrix.length; i++) {
            result[j][i] = matrix[i][j];
        }
    }
    return result;
}

// Fungsi untuk menampilkan pesan
function showMessage(message, type) {
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = `<div class="${type}">${message}</div>`;
    
    // Auto-hide setelah 3 detik untuk pesan sukses
    if (type === 'success') {
        setTimeout(() => {
            if (resultDiv.innerHTML.includes(message)) {
                resultDiv.innerHTML = '';
            }
        }, 3000);
    }
}

// Fungsi untuk validasi input angka
document.addEventListener('input', function(e) {
    if (e.target.classList.contains('matrix-input')) {
        const value = e.target.value;
        if (value !== '' && (isNaN(value) || value < -999 || value > 999)) {
            e.target.style.borderColor = '#dc3545';
            showMessage('Masukkan angka yang valid (-999 sampai 999)', 'error');
        } else {
            e.target.style.borderColor = '#dee2e6';
        }
    }
});

// Fungsi untuk menangani tombol Enter
document.addEventListener('keypress', function(e) {
    if (e.key === 'Enter' && e.target.classList.contains('matrix-input')) {
        calculateResult();
    }
});
