// *****************************************************************************
// Matrix Multiplication
// -----------------------------------------------------------------------------
// Background:  When I was learning about matrices in high
//   school, our textbook would only *describe* how to perform
//   matrix multiplication.  Something about matching this row
//   wih that column, then match this thing with that thing,
//   etc.  Oh, and make sure the sizes are compatible by this
//   rule and that.  It eventually makes sense, but it's a bit
//   'bleh' when you have to perform lots of matrix
//   multiplications by hand.
//
//   Instead, the process can be simplified visually if you
//   line up AxB so that A sits to the left of the result
//   and B sits above the result.  At this point, you no
//   longer need to count rows/columns.  Instead, just look
//   for where the row from A and column from B line up,
//   for each value in the result matrix.
//
//   This approach is nothing new.  But, I thought I would share
//   it, since it has helped me and my classmates throughout
//   high school and college.
//
// Best,
// Sam (aka CornerKitten)
// *****************************************************************************


// *****************************************************************************
// Matrix data *****************************************************************
// *****************************************************************************
var matrixDataA = [
    [1, 2],
    [3, 4],
    ];
var matrixDataB = [
    [5, 6],
    [7, 8],
    ];


// *****************************************************************************
// MatrixView class ************************************************************
// *****************************************************************************
// Constraint: Properties of `drawProps.text` are assumed to
//   never change.  For example, drawProps.text.size should
//   never be animated.
var MatrixView = function(x, y, matrixData, drawProps) {
    this.matrix = matrixData;
    this.x = x;
    this.y = y;
    this.rowHeight = 48;
    this.columnWidth = 48;
    this.drawProps = drawProps;

    this.drawProps.apply();
    this.entryOffset_ = {
        x: textWidth('00'),
        y: textAscent() / 3,
    };
    this.braceConfig_ = {
        width: textWidth('0'),
        height: textAscent() * 2 + this.rowHeight * (this.matrix.length - 1),
        thickness: 4,
    };
};

MatrixView.prototype.getEntryPosition = function(rowIndex, columnIndex) {
    return {
        x: this.x + columnIndex * this.columnWidth + this.entryOffset_.x,
        y: this.y + rowIndex * this.rowHeight - this.entryOffset_.y,
    };
};

MatrixView.prototype.getEntry = function(rowIndex, columnIndex) {
    return this.matrix[rowIndex][columnIndex];
};

MatrixView.prototype.setEntry = function(rowIndex, columnIndex, entry) {
    this.matrix[rowIndex][columnIndex] = entry;
};

MatrixView.prototype.getWidth = function() {
    var columnCount = this.matrix[0].length;
    return columnCount * this.columnWidth + this.braceConfig_.width * 2 -
        textWidth('0') / 2 + this.braceConfig_.thickness;
};

MatrixView.prototype.getHeight = function() {
    return this.braceConfig_.height + this.braceConfig_.thickness;
};

MatrixView.prototype.draw = function() {
    this.drawProps.apply();
    this.drawBrace(true);
    this.drawBrace(false);
    this.drawMatrixValues();
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


// *****************************************************************************
// Highlight class *************************************************************
// *****************************************************************************
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


// *****************************************************************************
// Dialogue class **************************************************************
// *****************************************************************************
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
    if (this.width !== undefined && this.height !== undefined) {
        // TODO Determine whether padding should apply for y
        text(this.message,
            this.x + this.padding,
            this.y,
            this.width - this.padding * 2,
            this.height);
    } else {
        // TODO Determine whether padding should apply
        text(this.message, this.x, this.y);
    }
};

Dialogue.prototype.applyDrawConfig = function() {
    var myText = this.drawConfig.text;
    var fillColor = this.drawConfig.fillColor;

    textFont(myText.font, myText.size);
    fill(fillColor.r, fillColor.g, fillColor.b, fillColor.a);
    textAlign(myText.halign, myText.valign);
};


// *****************************************************************************
// DrawProps class *************************************************************
// *****************************************************************************
var DrawProps = function(props) {
    // Since JSON.parse/.stringify is not available, and we want to ensure
    // browser compatibility, we'll perform our copy the verbose way
    // (which is probably fine, since I'm not sure if a font instance
    // is serializable)
    if (props.text) {
        this.text = {
            font: props.text.font,
            size: props.text.size,
            halign: props.text.halign,
            valign: props.text.valign,
        };
    }
    if (props.strokeColor) {
        this.strokeColor = {
            r: props.strokeColor.r,
            g: props.strokeColor.g,
            b: props.strokeColor.b,
            a: props.strokeColor.a,
        };
    }
    if (props.fillColor) {
        this.fillColor = {
            r: props.fillColor.r,
            g: props.fillColor.g,
            b: props.fillColor.b,
            a: props.fillColor.a,
        };
    }
};

DrawProps.prototype.apply = function() {
    if (this.text && this.text.font) {
        textFont(this.text.font, this.text.size);
    }
    if (this.text && this.text.size) {
        textSize(this.text.size);
    }
    // TODO Consider allowing single align to be set
    if (this.text && this.text.halign !== undefined &&
        this.text.valign !== undefined)
    {
        textAlign(this.text.halign, this.text.valign);
    }
    if (this.strokeColor) {
        stroke(this.strokeColor.r,
            this.strokeColor.g,
            this.strokeColor.b,
            this.strokeColor.a);
    }
    if (this.fillColor) {
        fill(this.fillColor.r,
            this.fillColor.g,
            this.fillColor.b,
            this.fillColor.a);
    }
};


// *****************************************************************************
// Tweener class ***************************************************************
// *****************************************************************************
var Tweener = function() {
    this.tweens = [];
};

Tweener.prototype.to = function(subject, duration, key, endValue, isRepeating,
        previous)
    {
    var now = millis();

    var tween = {
        subject: subject,
        duration: duration,
        key: key,
        startValue: subject[key],
        endValue: endValue,
        diffValue: endValue - subject[key],
        startTime: now,
        isRepeating: isRepeating || false,
        previous: previous,
    };
    if (previous) {
        previous.next = tween;
    } else {
        this.tweens.push(tween);
    }

    var that = this;
    return {
        then: function(subject, duration, key, value, isRepeating) {
            return that.to(subject, duration, key, value, isRepeating, tween);
        },
    };
};

Tweener.prototype.update = function() {
    var now = millis();
    var remainingTweens = [];

    this.tweens.forEach(function(tween) {
        var fractionComplete = (now - tween.startTime) / tween.duration;


        if (fractionComplete > 1) {
            tween.subject[tween.key] = tween.endValue;

            var nextTween;
            if (tween.next !== undefined) {
                nextTween = tween.next;
            } else if (tween.isRepeating) {
                nextTween = tween;
                while (nextTween.previous) {
                    nextTween = nextTween.previous;
                }
            }
            if (nextTween) {
                nextTween.startTime = now;
                nextTween.startValue = nextTween.subject[nextTween.key];
                nextTween.diffValue = nextTween.endValue - nextTween.startValue;
                remainingTweens.push(nextTween);
            }
        } else {
            tween.subject[tween.key] = tween.startValue +
                tween.diffValue * fractionComplete;
            remainingTweens.push(tween);
        }
    });

    this.tweens = remainingTweens;
};


// *****************************************************************************
// Text and init setup *********************************************************
// *****************************************************************************
var monospaceFont = createFont('monospace');
var sansSerifFont = createFont('sans-serif');
// TODO Refactor so that we don't have to manually set font
//      properties outside DrawProps
textFont(monospaceFont, 24);
textAlign(CENTER);


// *****************************************************************************
// Matrix setup ****************************************************************
// *****************************************************************************
var matrixDataProduct = [
    [
        matrixDataA[0][0] * matrixDataB[0][0] +
            matrixDataA[0][1] * matrixDataB[1][0],
        matrixDataA[0][0] * matrixDataB[0][1] +
            matrixDataA[0][1] * matrixDataB[1][1],
    ],
    [
        matrixDataA[1][0] * matrixDataB[0][0] +
            matrixDataA[1][1] * matrixDataB[1][0],
        matrixDataA[1][0] * matrixDataB[0][1] +
            matrixDataA[1][1] * matrixDataB[1][1],
    ],
];
var matrixDataBlank = [
    ['', ''],
    ['', ''],
];
var matrixDrawConfig = {
    text: {
        font: monospaceFont,
        size: 24,
        halign: CENTER,
        valign: BASELINE,
    },
    strokeColor: { r: 255, g: 255, b: 255, a: 200 },
    fillColor: { r: 255, g: 255, b: 255, a: 200 },
};

// Create views for matrices
var matrixA = new MatrixView(75, 75, matrixDataA,
    new DrawProps(matrixDrawConfig));
var matrixB = new MatrixView(75, 75, matrixDataB,
    new DrawProps(matrixDrawConfig));

matrixDrawConfig.strokeColor.a = 0;
matrixDrawConfig.fillColor.a = 0;
var matrixProduct = new MatrixView(75, 75, matrixDataBlank,
    new DrawProps(matrixDrawConfig));

// Position matrices
var matrixSpacing = 16;
matrixB.x += matrixA.getWidth() + matrixSpacing;
matrixProduct.x += matrixA.getWidth() + matrixSpacing;
matrixA.y += matrixB.getHeight() + matrixSpacing;
matrixB.y += matrixB.getHeight() + matrixSpacing;
matrixProduct.y += matrixB.getHeight() + matrixSpacing;

// Create highlights for matrix entries
var highlightA = new Highlight(0, 0, 40);
var highlightB = new Highlight(0, 0, 40);
var highlightProduct = new Highlight(0, 0, 40);


// *****************************************************************************
// Dialogue setup **************************************************************
// *****************************************************************************
var dialogue = new Dialogue(
    0,
    matrixA.y + matrixA.getHeight(),
    '',
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
var equation = new Dialogue(
    0,
    height * 3 / 4 + 28,
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
        fillColor: { r: 255, g: 255, b: 255, a: 200 },
    });
var actionDialogue = new Dialogue(
    width - 24,
    height - 8,
    '→',
    undefined,
    undefined,
    0,
    {
        text: {
            font: monospaceFont,
            size: 40,
            halign: RIGHT,
            valign: BOTTOM,
        },
        fillColor: { r: 255, g: 255, b: 255, a: 150 },
    });


// *****************************************************************************
// Scene management ************************************************************
// *****************************************************************************
var BASE_DURATION = 300;
var tweener = new Tweener();
var currentScene = 0;

var scenes = [
    function() {
        dialogue.message = 'Suppose we want to multiply two matrices.';

        tweener.to(actionDialogue, BASE_DURATION * 4,
                'x', actionDialogue.x + 12)
            .then(actionDialogue, BASE_DURATION * 4,
                'x', actionDialogue.x, true);
    },
    function() {
        dialogue.message = 'We can just align the second matrix like so.';
        tweener.to(matrixB, BASE_DURATION, 'y', matrixB.y -
            matrixB.getHeight() - matrixSpacing);
    },
    function() {
        dialogue.message = 'Then add a placeholder for the matrix product.';
        tweener.to(matrixProduct.drawProps.fillColor, BASE_DURATION, 'a', 200);
        tweener.to(matrixProduct.drawProps.strokeColor, BASE_DURATION,
            'a', 200);
    },
    function() {
        dialogue.message = 'Now, we want to determine the first value.';
        var position = matrixProduct.getEntryPosition(0, 0);
        highlightProduct.x = position.x;
        highlightProduct.y = position.y;
        tweener.to(highlightProduct.drawConfig.fillColor, BASE_DURATION,
            'a', 255);
    },
    function() {
        dialogue.message = 'So, we multiply the first entry on the left...';
        equation.message = '(' + matrixA.getEntry(0, 0) + ' x ';
        var position = matrixA.getEntryPosition(0, 0);
        highlightA.x = position.x;
        highlightA.y = position.y;
        tweener.to(highlightA.drawConfig.fillColor, BASE_DURATION, 'a', 255);
    },
    function() {
        dialogue.message = 'By the top entry above.';
        equation.message += matrixB.getEntry(0, 0) + ')';
        var position = matrixB.getEntryPosition(0, 0);
        highlightB.x = position.x;
        highlightB.y = position.y;
        tweener.to(highlightB.drawConfig.fillColor, BASE_DURATION, 'a', 255);
    },
    function() {
        dialogue.message = 'Then move inward.';
        equation.message += ' + ';
        var positionA = matrixA.getEntryPosition(0, 1);
        tweener.to(highlightA, BASE_DURATION, 'x', positionA.x);
        var positionB = matrixB.getEntryPosition(1, 0);
        tweener.to(highlightB, BASE_DURATION, 'y', positionB.y);
    },
    function() {
        equation.message += '(' + matrixA.getEntry(0, 1) + ' x ';
        tweener.to(highlightA, BASE_DURATION, 'radius', highlightA.radius + 10);
    },
    function() {
        equation.message += matrixB.getEntry(1, 0) + ')';
        tweener.to(highlightA, BASE_DURATION, 'radius', highlightA.radius - 10);
        tweener.to(highlightB, BASE_DURATION, 'radius', highlightB.radius + 10);
    },
    function() {
        dialogue.message = 'Which produces';
        equation.message += ' = ';
        tweener.to(highlightB, BASE_DURATION, 'radius', highlightB.radius - 10);
        tweener.to(highlightA.drawConfig.fillColor, BASE_DURATION, 'a', 0);
        tweener.to(highlightB.drawConfig.fillColor, BASE_DURATION, 'a', 0);
    },
    function() {
        equation.message += matrixDataProduct[0][0];
        matrixProduct.setEntry(0, 0, matrixDataProduct[0][0]);
        tweener.to(highlightProduct, BASE_DURATION,
            'radius', highlightProduct.radius + 10);
    },
    function() {
        dialogue.message = 'Now, repeat the process.';
        equation.message = '';
        tweener.to(highlightProduct, BASE_DURATION,
            'radius', highlightProduct.radius - 10);
    },
    function() {
        var position = matrixProduct.getEntryPosition(0, 1);
        tweener.to(highlightProduct, BASE_DURATION, 'x', position.x);
    },
    function() {
        equation.message = '(' + matrixA.getEntry(0, 0) + ' x ';
        var position = matrixA.getEntryPosition(0, 0);
        highlightA.x = position.x;
        highlightA.y = position.y;
        tweener.to(highlightA.drawConfig.fillColor, BASE_DURATION, 'a', 255);
    },
    function() {
        equation.message += matrixB.getEntry(0, 1) + ')';
        var position = matrixB.getEntryPosition(0, 1);
        highlightB.x = position.x;
        highlightB.y = position.y;
        tweener.to(highlightB.drawConfig.fillColor, BASE_DURATION, 'a', 255);
    },
    function() {
        equation.message += ' + ';
        var positionA = matrixA.getEntryPosition(0, 1);
        tweener.to(highlightA, BASE_DURATION, 'x', positionA.x);
        var positionB = matrixB.getEntryPosition(1, 1);
        tweener.to(highlightB, BASE_DURATION, 'y', positionB.y);
    },
    function() {
        equation.message += '(' + matrixA.getEntry(0, 1);
        tweener.to(highlightA, BASE_DURATION, 'radius', highlightA.radius + 10);
    },
    function() {
        equation.message += ' x ' +matrixB.getEntry(1, 1) + ')';
        tweener.to(highlightA, BASE_DURATION, 'radius', highlightA.radius - 10);
        tweener.to(highlightB, BASE_DURATION, 'radius', highlightB.radius + 10);
    },
    function() {
        dialogue.message = 'Which produces';
        equation.message += ' = ';
        tweener.to(highlightB, BASE_DURATION, 'radius', highlightB.radius - 10);
        tweener.to(highlightA.drawConfig.fillColor, BASE_DURATION, 'a', 0);
        tweener.to(highlightB.drawConfig.fillColor, BASE_DURATION, 'a', 0);
    },
    function() {
        matrixProduct.setEntry(0, 1, matrixDataProduct[0][1]);
        equation.message += matrixDataProduct[0][1];
        tweener.to(highlightProduct, BASE_DURATION,
            'radius', highlightProduct.radius + 10);
    },
    function() {
        dialogue.message = '';
        equation.message = '';
        tweener.to(highlightProduct, BASE_DURATION,
            'radius', highlightProduct.radius - 10);
    }
];

var nextScene = function() {
    // TODO Update currentScene so it properly references our furthest
    //      called scene function, instead of looking like an
    //      off-by-one-error
    if (currentScene < scenes.length) {
        scenes[currentScene]();
        currentScene++;

        tweener.to(actionDialogue.drawConfig.fillColor, 0, 'a', 0)
            .then(actionDialogue.drawConfig.fillColor, 2000, 'a', 0)
            .then(actionDialogue.drawConfig.fillColor, 2000, 'a', 75);

        // TODO Ensure that, once last scene is loaded:
        //       - cursor is set back to normal
        //       - actionDialogue does not reappear
        cursor(HAND);
    }
};

mouseClicked = nextScene;

// *****************************************************************************
// Start ***********************************************************************
// *****************************************************************************
nextScene();

// *****************************************************************************
// Draw ************************************************************************
// *****************************************************************************
draw = function() {
    tweener.update();
    background(81, 207, 245);

    highlightA.draw();
    highlightB.draw();
    highlightProduct.draw();
    matrixA.draw();
    matrixB.draw();
    matrixProduct.draw();
    actionDialogue.draw();
    dialogue.draw();
    equation.draw();
    actionDialogue.draw();
};
