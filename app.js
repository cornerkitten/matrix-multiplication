// TODO Replace arrow functions with anonymous functions

// *************************************************************
// MatrixView class ********************************************
// *************************************************************
var MatrixView = function(x, y, matrixData) {
    this.matrix = matrixData;
    this.x = x;
    this.y = y;
    this.rowHeight = 48;
    this.columnWidth = 48;
    this.braceConfig = this.calculatedBraceConfig();
    this.highlights_ = [];

    var rowCount = this.matrix.length;
    var columnCount = this.matrix[0].length;
    for (var rowIndex = 0; rowIndex < rowCount; rowIndex++) {
        this.highlights_[rowIndex] = [];
        for (var columnIndex = 0; columnIndex < columnCount; columnIndex++) {
            this.highlights_[rowIndex][columnIndex] = false;
        }
    }
};

MatrixView.prototype.setHighlight = function(row, col, isHighlight) {
    this.highlights_[row][col] = isHighlight;
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

            if (this.highlights_[rowIndex][columnIndex]) {
                noStroke();
                fill(34, 148, 201, 200);
                ellipse(
                    this.x + columnIndex * this.columnWidth + textWidth('00'),
                    this.y + rowIndex * this.rowHeight - textAscent() / 3,
                    40,
                    40);
                stroke(255, 255, 255, 200);
                fill(255, 255, 255, 200);
            }
            text(value,
                this.x + columnIndex * this.columnWidth + textWidth('00'),
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
            x: this.x - width,
            y: this.y - textAscent() * 1.5,
        };
    } else {
        bracePosition = {
            x: this.x + columnCount * this.columnWidth +
                width,
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
    return columnCount * this.columnWidth + this.braceConfig.width * 2 -
        textWidth('0') / 2 + this.braceConfig.thickness;
};

MatrixView.prototype.getHeight = function() {
    return this.braceConfig.height + this.braceConfig.thickness;
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

// *************************************************************
// Tweener class ***********************************************
// *************************************************************
var Tweener = function() {
    // TODO
    this.tweens = [];
};

Tweener.prototype.to = function(parent, duration, key, value) {
    // TODO
    var now = millis();

    this.tweens.push({
        parent: parent,
        duration: duration,
        key: key,
        startValue: parent[key],
        diffValue: value - parent[key],
        startTime: now,
    });
};

Tweener.prototype.update = function() {
    // TODO
    var now = millis();
    var remainingTweens = [];

    this.tweens.forEach(function(tween) {
        var fractionComplete = (now - tween.startTime) / tween.duration;

        if (fractionComplete > 1) {
            tween.parent[tween.key] = tween.startValue + tween.diffValue;
        } else {
            tween.parent[tween.key] = tween.startValue +
                tween.diffValue * fractionComplete;
            remainingTweens.push(tween);
        }
    });

    this.tweens = remainingTweens;
};

// *************************************************************
// Setup *******************************************************
// *************************************************************
var monospaceFont = createFont('monospace');
var sansSerifFont = createFont('sans-serif');
textFont(monospaceFont, 24);
textAlign(CENTER);

var matrixDataA = [
    [1, 2],
    [3, 4],
    ];
var matrixDataB = [
    [5, 6],
    [7, 8],
    ];
var matrixDataC = [
    ['x', 'yy'],
    ['zz', 'w'],
    ];
// var matrixDataB = [
//     [5, 6, 1],
//     [7, 8, 2],
//     [1, 2, 3],
//     [7, 8, 4],
//     [1, 2, 5],
//     ];
var matrixSpacing = 16;
var matrixViewA = new MatrixView(75, 100, matrixDataA);
var matrixViewB = new MatrixView(75, 100, matrixDataB);
var matrixViewC = new MatrixView(75, 100, matrixDataC);
matrixViewB.x += matrixViewA.getWidth() + matrixSpacing;
matrixViewC.x += matrixViewA.getWidth() + matrixSpacing;
matrixViewA.y += matrixViewB.getHeight() + matrixSpacing;
matrixViewB.y += matrixViewB.getHeight() + matrixSpacing;
matrixViewC.y += matrixViewB.getHeight() + matrixSpacing;

matrixViewA.setHighlight(0, 0, true);
matrixViewB.setHighlight(0, 0, true);
matrixViewC.setHighlight(0, 0, true);

var dialogueBox = {
    x: 0,
    y: matrixViewA.y + matrixViewA.getHeight() + 50 - 16,
    message: 42, //
    width: width,
    height: height,
    padding: {
        x: 16,
        y: 16,
    },
};
var tweener = new Tweener();
// tweener.to(dialogueBox, 3000, 'message', 4200);
tweener.to(matrixViewB, 300 * 5, 'y', matrixViewB.y -
    matrixViewB.getHeight() - matrixSpacing);

// *************************************************************
// Draw ********************************************************
// *************************************************************
draw = function() {
    tweener.update();

    textFont(monospaceFont, 24);
    textAlign(CENTER, BASELINE);
    background(81, 207, 245);
    matrixViewA.draw();
    matrixViewB.draw();
    // matrixViewC.draw();

    // Diagloue box
    // fill(255, 255, 255, 200);
    // noStroke();
    // rect(dialogueBox.x, dialogueBox.y, dialogueBox.width, dialogueBox.height);
    // fill(22, 53, 61);
    // stroke(255, 255, 255, 200);
    // // stroke(0, 0, 0);
    // textFont(sansSerifFont, 16);
    // textAlign(LEFT, TOP);
    // text(dialogueBox.message, dialogueBox.x + dialogueBox.padding.x,
    //     dialogueBox.y + dialogueBox.padding.x);
};
