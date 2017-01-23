// *************************************************************
// Matrix Multiplication
// -------------------------------------------------------------
// Background:  When I was learning about matrices in high
//   school, our textbook would only *describe* how to perform
//   matrix multiplication.  Something about matching this row
//   wih that column, then match this thing with that thing,
//   etc.  Oh, and make sure the sizes are compatible by this
//   rule and that.  Bleh.
//
//   Instead, the process can be simplified visually if you
//   line up AxB so that A sits to the left of the result
//   and B sits above the result.  At this point, you no
//   longer need to count rows/columns.  Instead, just look
//   for where the row from A and column from B line up,
//   for each value in the result matrix.
//
//   This approach is nothing new, but it's often overlooked.
//   So, I thought I would share it, since it has helped me
//   and my classmates throughout high school and college.
//
// Best,
// Sam (aka CornerKitten)
// *************************************************************


// *************************************************************
// MatrixView class ********************************************
// *************************************************************
var MatrixView = function(x, y, matrixData, drawConfig) {
    this.matrix = matrixData;
    this.x = x;
    this.y = y;
    this.rowHeight = 48;
    this.columnWidth = 48;
    this.drawConfig = drawConfig;
    this.braceConfig_ = this.calculatedBraceConfig();

    var rowCount = this.matrix.length;
    var columnCount = this.matrix[0].length;
};

MatrixView.prototype.getEntryPosition = function(rowIndex, columnIndex) {
    return {
        x: this.x + columnIndex * this.columnWidth + textWidth('00'),
        y: this.y + rowIndex * this.rowHeight - textAscent() / 3,
    };
};

MatrixView.prototype.draw = function() {
    this.applyDrawConfig();
    this.drawBrace(true);
    this.drawBrace(false);
    this.drawMatrixValues();
};

MatrixView.prototype.applyDrawConfig = function() {
    var myText = this.drawConfig.text;
    var strokeColor = this.drawConfig.strokeColor;
    var fillColor = this.drawConfig.fillColor;

    textFont(myText.font, myText.size);
    textAlign(myText.halign, myText.valign);
    stroke(strokeColor.h,
        strokeColor.s,
        strokeColor.b,
        strokeColor.a);
    fill(fillColor.h,
        fillColor.s,
        fillColor.b,
        fillColor.a);
};

MatrixView.prototype.drawMatrixValues = function() {
    for (var rowIndex = 0; rowIndex < this.matrix.length; rowIndex++) {
        var row = this.matrix[rowIndex];

        for (var columnIndex = 0; columnIndex < row.length; columnIndex++) {
            var entry = row[columnIndex];

            text(entry,
                this.x + columnIndex * this.columnWidth + textWidth('00'),
                this.y + rowIndex * this.rowHeight);
        }
    }
};

MatrixView.prototype.drawBrace = function(isLeftBracket) {
    var columnCount = this.matrix[0].length;
    var thickness = this.braceConfig_.thickness;
    var height = this.braceConfig_.height;
    var width = this.braceConfig_.width;

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
    return columnCount * this.columnWidth + this.braceConfig_.width * 2 -
        textWidth('0') / 2 + this.braceConfig_.thickness;
};

MatrixView.prototype.getHeight = function() {
    return this.braceConfig_.height + this.braceConfig_.thickness;
};

// Should be used to update `this.braceConfig_` whenever
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
// Highlight class *********************************************
// *************************************************************
var Highlight = function(x, y, radius) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.drawConfig = {
        fillColor: { r: 34, g: 148, b: 201, a: 0 },
    };
};

Highlight.prototype.draw = function() {
    var fillColor = this.drawConfig.fillColor;

    fill(fillColor.r, fillColor.g, fillColor.b, fillColor.a);
    noStroke();
    ellipse(this.x, this.y, this.radius, this.radius);
};


// *************************************************************
// Text setup **************************************************
// *************************************************************
var monospaceFont = createFont('monospace');
var sansSerifFont = createFont('sans-serif');
textFont(monospaceFont, 24);
textAlign(CENTER);

var textConfig = {
    font: monospaceFont,
    size: 24,
    halign: CENTER,
    valign: BASELINE,
};


// *************************************************************
// Matrix setup ************************************************
// *************************************************************
var drawConfigA = {
    text: textConfig,
    strokeColor: { h: 255, s: 255, b: 255, a: 200 },
    fillColor: { h: 255, s: 255, b: 255, a: 200 },
};
var drawConfigB = {
    text: textConfig,
    strokeColor: { h: 255, s: 255, b: 255, a: 200 },
    fillColor: { h: 255, s: 255, b: 255, a: 200 },
};
var drawConfigC = {
    text: textConfig,
    strokeColor: { h: 255, s: 255, b: 255, a: 0 },
    fillColor: { h: 255, s: 255, b: 255, a: 0 },
};

var matrixDataA = [
    [1, 2],
    [3, 4],
    ];
var matrixDataB = [
    [5, 6],
    [7, 8],
    ];
var matrixDataC = [
    ['', ''],
    ['', ''],
    ];
var matrixSpacing = 16;
var matrixViewA = new MatrixView(75, 100, matrixDataA, drawConfigA);
var matrixViewB = new MatrixView(75, 100, matrixDataB, drawConfigB);
var matrixViewC = new MatrixView(75, 100, matrixDataC, drawConfigC);
matrixViewB.x += matrixViewA.getWidth() + matrixSpacing;
matrixViewC.x += matrixViewA.getWidth() + matrixSpacing;
matrixViewA.y += matrixViewB.getHeight() + matrixSpacing;
matrixViewB.y += matrixViewB.getHeight() + matrixSpacing;
matrixViewC.y += matrixViewB.getHeight() + matrixSpacing;
var highlightA = new Highlight(0, 0, 40);
var highlightB = new Highlight(0, 0, 40);


// *************************************************************
// Scene management ********************************************
// *************************************************************
var tweener = new Tweener();

var scenes = [
    function() {
        tweener.to(matrixViewB, 300 * 5, 'y', matrixViewB.y -
            matrixViewB.getHeight() - matrixSpacing);
    },
    function() {
        tweener.to(matrixViewC.drawConfig.fillColor, 300 * 5, 'a', 200);
        tweener.to(matrixViewC.drawConfig.strokeColor, 300 * 5, 'a', 200);
    },
    function() {
        var position = matrixViewA.getEntryPosition(0, 0);
        highlightA.x = position.x;
        highlightA.y = position.y;
        tweener.to(highlightA.drawConfig.fillColor, 300 * 5, 'a', 255);
    },
    function() {
        var position = matrixViewB.getEntryPosition(0, 0);
        highlightB.x = position.x;
        highlightB.y = position.y;
        tweener.to(highlightB.drawConfig.fillColor, 300 * 5, 'a', 255);
    },
];
var currentScene = 0;

mouseClicked = function() {
    if (currentScene < scenes.length) {
        scenes[currentScene]();
        currentScene++;
    }
};


// *************************************************************
// Draw ********************************************************
// *************************************************************
draw = function() {
    tweener.update();
    background(81, 207, 245);

    highlightA.draw();
    highlightB.draw();
    matrixViewA.draw();
    matrixViewB.draw();
    matrixViewC.draw();
};
