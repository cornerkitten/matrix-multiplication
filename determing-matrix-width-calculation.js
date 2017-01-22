// **************************************************
// MatrixView class *********************************
// **************************************************
var MatrixView = function(x, y, matrixData) {
    this.matrix = matrixData;
    this.x = x;
    this.y = y;
    this.rowHeight = 32;
    this.columnWidth = 32;
    this.braceConfig = this.calculatedBraceConfig();
};

MatrixView.prototype.draw = function() {
    this.drawBrace(true);
    this.drawBrace(false);
    this.drawMatrixValues();
};

MatrixView.prototype.drawMatrixValues = function() {
    for (var rowIndex = 0; rowIndex < this.matrix.length; rowIndex++) {
        var row = this.matrix[rowIndex];

        for (var columnIndex = 0; columnIndex < row.length; columnIndex++) {
            var value = row[columnIndex];
            text(value,
                this.x + columnIndex * this.columnWidth,
                this.y + rowIndex * this.rowHeight);
        }
    }
};

MatrixView.prototype.drawBrace = function(isLeftBracket) {
    var columnCount = this.matrix[0].length;
    var thickness = this.braceConfig.thickness;
    var height = this.braceConfig.height;
    var width = this.braceConfig.width;

    var bracePosition;
    if (isLeftBracket) {
        bracePosition = {
            x: this.x - width - textWidth('0') / 2,
            y: this.y - textAscent() * 1.5,
        };
    } else {
        bracePosition = {
            x: this.x + columnCount * this.columnWidth +
                width - textWidth('0'),
            y: this.y - textAscent() * 1.5,
        };
    }

    strokeWeight(thickness);

    // Vertical bar
    line(bracePosition.x,
        bracePosition.y,
        bracePosition.x,
        bracePosition.y + height);
    // Top nub
    line(bracePosition.x + (isLeftBracket ? 0 : -thickness / 2),
        bracePosition.y,
        bracePosition.x + (isLeftBracket ? width : -width),
        bracePosition.y);
    // Bottom nub
    line(bracePosition.x + (isLeftBracket ? 0 : -thickness / 2),
        bracePosition.y + height + thickness / 2,
        bracePosition.x + (isLeftBracket ? width : -width),
        bracePosition.y + height + thickness / 2);
};

MatrixView.prototype.getWidth = function() {
    var columnCount = this.matrix[0].length;
    // return width + textWidth('0') / 2 + columnCount * this.columnWidth +
    //             width - textWidth('0');
    return columnCount * this.columnWidth;
};

MatrixView.prototype.getHeight = function() {
    return this.braceConfig.height + this.braceConfig.thickness / 2;
};

// Should be used to update `this.braceConfig` whenever
// font size or matrix size changes
MatrixView.prototype.calculatedBraceConfig = function() {
    return {
        width: textWidth('0'),
        height: textAscent() * 2 + this.rowHeight * (this.matrix.length - 1),
        thickness: 4,
    };
};

// **************************************************
// Setup ********************************************
// **************************************************
var font = createFont('monospace');
textFont(font, 24);

var matrixDataA = [
    [1, 2],
    [3, 4],
    ];
var matrixDataB = [
    [5, 6, 1],
    [7, 8, 2],
    [1, 2, 3],
    [7, 8, 4],
    [1, 2, 5],
    ];
var matrixViewA = new MatrixView(100, 100, matrixDataA);
var matrixViewB = new MatrixView(100, 100, matrixDataB);
matrixViewB.x += matrixViewA.getWidth();
matrixViewB.y -= matrixViewB.getHeight();

// **************************************************
// Draw *********************************************
// **************************************************
draw = function() {
    background(255, 255, 255);
    fill(81, 207, 245);
    stroke(81, 207, 245);
    matrixViewA.draw();
    matrixViewB.draw();
};
