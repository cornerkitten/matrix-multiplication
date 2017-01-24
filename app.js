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
    stroke(strokeColor.r,
        strokeColor.g,
        strokeColor.b,
        strokeColor.a);
    fill(fillColor.r,
        fillColor.g,
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

MatrixView.prototype.getEntryPosition = function(rowIndex, columnIndex) {
    return {
        x: this.x + columnIndex * this.columnWidth + textWidth('00'),
        y: this.y + rowIndex * this.rowHeight - textAscent() / 3,
    };
};

MatrixView.prototype.getEntry = function(rowIndex, columnIndex) {
    return this.matrix[rowIndex][columnIndex];
};

MatrixView.prototype.setEntry = function(rowIndex, columnIndex, entry) {
    this.matrix[rowIndex][columnIndex] = entry;
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
// Dialogue class **********************************************
// *************************************************************
var Dialogue = function(x, y, message, width, height, padding, drawConfig) {
    this.x = x;
    this.y = y;
    this.message = message || '';
    this.width = width;
    this.height = height;
    this.padding = padding;
    this.drawConfig = drawConfig;
};

Dialogue.prototype.draw = function() {
    this.applyDrawConfig();
    text(this.message,
        this.x + this.padding,
        this.y,
        this.width - this.padding * 2,
        this.height);
};

Dialogue.prototype.applyDrawConfig = function() {
    var myText = this.drawConfig.text;
    var fillColor = this.drawConfig.fillColor;

    textFont(myText.font, myText.size);
    fill(fillColor.r, fillColor.g, fillColor.b, fillColor.a);
    textAlign(myText.halign, myText.valign);
};


// *************************************************************
// Tweener class ***********************************************
// *************************************************************
var Tweener = function() {
    this.tweens = [];
};

Tweener.prototype.to = function(parent, duration, key, value) {
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
// Text property setup *****************************************
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
    strokeColor: { r: 255, g: 255, b: 255, a: 200 },
    fillColor: { r: 255, g: 255, b: 255, a: 200 },
};
var drawConfigB = {
    text: textConfig,
    strokeColor: { r: 255, g: 255, b: 255, a: 200 },
    fillColor: { r: 255, g: 255, b: 255, a: 200 },
};
var drawConfigC = {
    text: textConfig,
    strokeColor: { r: 255, g: 255, b: 255, a: 0 },
    fillColor: { r: 255, g: 255, b: 255, a: 0 },
};

var matrixDataA = [
    [1, 2],
    [3, 4],
    ];
var matrixDataB = [
    [5, 6],
    [7, 8],
    ];
var matrixProductData = [
    [
        matrixDataA[0][0] * matrixDataB[0][0] + matrixDataA[0][1] * matrixDataB[1][0],
        matrixDataA[0][0] * matrixDataB[0][1] + matrixDataA[0][1] * matrixDataB[1][1],
    ],
    [
        matrixDataA[1][0] * matrixDataB[0][0] + matrixDataA[1][1] * matrixDataB[1][0],
        matrixDataA[1][0] * matrixDataB[0][1] + matrixDataA[1][1] * matrixDataB[1][1],
    ],
];
var matrixDataBlank = [
    ['', ''],
    ['', ''],
    ];
var matrixSpacing = 16;
// TODO Consider rename matrixViewA -> matrixA
var matrixViewA = new MatrixView(75, 100, matrixDataA, drawConfigA);
var matrixViewB = new MatrixView(75, 100, matrixDataB, drawConfigB);
var matrixProduct = new MatrixView(75, 100, matrixDataBlank, drawConfigC);
matrixViewB.x += matrixViewA.getWidth() + matrixSpacing;
matrixProduct.x += matrixViewA.getWidth() + matrixSpacing;
matrixViewA.y += matrixViewB.getHeight() + matrixSpacing;
matrixViewB.y += matrixViewB.getHeight() + matrixSpacing;
matrixProduct.y += matrixViewB.getHeight() + matrixSpacing;

var highlightA = new Highlight(0, 0, 40);
var highlightB = new Highlight(0, 0, 40);
var highlightProduct = new Highlight(0, 0, 40);
var dialogue = new Dialogue(
    0,
    height * 3 / 4,
    'We have two matrices.',
    width,
    height,
    32,
    {
        text: {
            font: sansSerifFont,
            size: 24,
            halign: LEFT,
            valign: BASELINE,
        },
        fillColor: { r: 255, g: 255, b: 255, a: 200 },
    });
var equationDialogue = new Dialogue(
    0,
    height * 3 / 4 + 56,
    '',
    width,
    height,
    32,
    {
        text: {
            font: monospaceFont,
            size: 24,
            halign: LEFT,
            valign: BASELINE,
        },
        fillColor: { r: 255, g: 255, b: 255, a: 200 }
    });


// *************************************************************
// Scene management ********************************************
// *************************************************************
var BASE_DURATION = 300;
var tweener = new Tweener();
var currentScene = 0;

var scenes = [
    function() {
        dialogue.message = 'Instead of counting rows and columns for the product...';
    },
    function() {
        dialogue.message = 'We can just align the second matrix like so.';
        tweener.to(matrixViewB, BASE_DURATION, 'y', matrixViewB.y -
            matrixViewB.getHeight() - matrixSpacing);
    },
    function() {
        dialogue.message = 'Then add a placeholder for the matrix product.';
        tweener.to(matrixProduct.drawConfig.fillColor, BASE_DURATION, 'a', 200);
        tweener.to(matrixProduct.drawConfig.strokeColor, BASE_DURATION, 'a', 200);
    },
    function() {
        dialogue.message = 'Now, we want to determine the first value.';
        var position = matrixProduct.getEntryPosition(0, 0);
        highlightProduct.x = position.x;
        highlightProduct.y = position.y;
        tweener.to(highlightProduct.drawConfig.fillColor, BASE_DURATION, 'a', 255);
    },
    function() {
        dialogue.message = 'So, we multiply the first entry on the left...';
        equationDialogue.message = '(' + matrixViewA.getEntry(0, 0) + ' x ';
        var position = matrixViewA.getEntryPosition(0, 0);
        highlightA.x = position.x;
        highlightA.y = position.y;
        tweener.to(highlightA.drawConfig.fillColor, BASE_DURATION, 'a', 255);
    },
    function() {
        dialogue.message = 'by the top entry above.';
        equationDialogue.message += matrixViewB.getEntry(0, 0) + ')';
        var position = matrixViewB.getEntryPosition(0, 0);
        highlightB.x = position.x;
        highlightB.y = position.y;
        tweener.to(highlightB.drawConfig.fillColor, BASE_DURATION, 'a', 255);
    },
    function() {
        dialogue.message = 'Then move inward.';
        equationDialogue.message += ' + ';
    },
    function() {
        equationDialogue.message += '(' + matrixViewA.getEntry(0, 1) + ' x ';
        var position = matrixViewA.getEntryPosition(0, 1);
        tweener.to(highlightA, BASE_DURATION, 'x', position.x);
    },
    function() {
        equationDialogue.message += matrixViewB.getEntry(1, 0) + ')';
        var position = matrixViewB.getEntryPosition(1, 0);
        tweener.to(highlightB, BASE_DURATION, 'y', position.y);
    },
    function() {
        dialogue.message = 'Which produces';
        equationDialogue.message += ' = ';
        tweener.to(highlightA.drawConfig.fillColor, BASE_DURATION, 'a', 0);
        tweener.to(highlightB.drawConfig.fillColor, BASE_DURATION, 'a', 0);
    },
    function() {
        matrixProduct.setEntry(0, 0, matrixProductData[0][0]);
        equationDialogue.message += matrixProductData[0][0];
    },
    function() {
        dialogue.message = 'Now, repeat the process.';
        equationDialogue.message = '';
    },
    function() {
        var position = matrixProduct.getEntryPosition(0, 1);
        tweener.to(highlightProduct, BASE_DURATION, 'x', position.x);
    },
    function() {
        equationDialogue.message = '(' + matrixViewA.getEntry(0, 0) + ' x ';
        var position = matrixViewA.getEntryPosition(0, 0);
        highlightA.x = position.x;
        highlightA.y = position.y;
        tweener.to(highlightA.drawConfig.fillColor, BASE_DURATION, 'a', 255);
    },
    function() {
        equationDialogue.message += matrixViewB.getEntry(0, 1) + ')';
        var position = matrixViewB.getEntryPosition(0, 1);
        highlightB.x = position.x;
        highlightB.y = position.y;
        tweener.to(highlightB.drawConfig.fillColor, BASE_DURATION, 'a', 255);
    },
    function() {
        equationDialogue.message += ' + ';
    },
    function() {
        equationDialogue.message += '(' + matrixViewA.getEntry(0, 1) + ' x ';
        var position = matrixViewA.getEntryPosition(0, 1);
        tweener.to(highlightA, BASE_DURATION, 'x', position.x);
    },
    function() {
        equationDialogue.message += matrixViewB.getEntry(1, 1) + ')';
        var position = matrixViewB.getEntryPosition(1, 1);
        tweener.to(highlightB, BASE_DURATION, 'y', position.y);
    },
    function() {
        dialogue.message = 'Which produces';
        equationDialogue.message += ' = ';
        tweener.to(highlightA.drawConfig.fillColor, BASE_DURATION, 'a', 0);
        tweener.to(highlightB.drawConfig.fillColor, BASE_DURATION, 'a', 0);
    },
    function() {
        matrixProduct.setEntry(0, 1, matrixProductData[0][1]);
        equationDialogue.message += matrixProductData[0][1];
    },
];

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
    highlightProduct.draw();
    matrixViewA.draw();
    matrixViewB.draw();
    matrixProduct.draw();
    dialogue.draw();
    equationDialogue.draw();
};
