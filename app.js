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
var Highlight = function(x, y, radius, drawProps) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.drawProps = drawProps;
};

Highlight.prototype.draw = function() {
    this.drawProps.apply();
    noStroke();
    ellipse(this.x, this.y, this.radius, this.radius);
};


// *****************************************************************************
// Dialogue class **************************************************************
// *****************************************************************************
var Dialogue = function(x, y, message, width, height, padding, drawProps) {
    this.x = x;
    this.y = y;
    this.message = message || '';
    this.width = width;
    this.height = height;
    this.padding = padding;
    this.drawProps = drawProps;
};

Dialogue.prototype.draw = function() {
    this.drawProps.apply();

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

Tweener.prototype.fastForward = function() {
    this.tweens.forEach(function(tween) {
        while (tween) {
            tween.subject[tween.key] = tween.endValue;
            tween = tween.next;
        }
    });

    this.tweens = [];
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
var matrixProps = {
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
var matrixA = new MatrixView(75, 75, matrixDataA, new DrawProps(matrixProps));
var matrixB = new MatrixView(75, 75, matrixDataB, new DrawProps(matrixProps));

matrixProps.strokeColor.a = 0;
matrixProps.fillColor.a = 0;
var matrixProduct = new MatrixView(75, 75, matrixDataBlank,
    new DrawProps(matrixProps));

// Position matrices
var matrixSpacing = 16;
matrixB.x += matrixA.getWidth() + matrixSpacing;
matrixProduct.x += matrixA.getWidth() + matrixSpacing;
matrixA.y += matrixB.getHeight() + matrixSpacing;
matrixB.y += matrixB.getHeight() + matrixSpacing;
matrixProduct.y += matrixB.getHeight() + matrixSpacing;

// Create highlights for matrix entries
var highlightConfig = {
    fillColor: { r: 34, g: 148, b: 201, a: 0 },
};
var highlightA = new Highlight(0, 0, 40, new DrawProps(highlightConfig));
var highlightB = new Highlight(0, 0, 40, new DrawProps(highlightConfig));
var highlightProduct = new Highlight(0, 0, 40, new DrawProps(highlightConfig));


// *****************************************************************************
// Dialogue setup **************************************************************
// *****************************************************************************
var dialogueProps = new DrawProps({
    text: {
        font: sansSerifFont,
        size: 24,
        halign: LEFT,
        valign: BASELINE,
    },
    fillColor: { r: 255, g: 255, b: 255, a: 200 },
});
var dialogue = new Dialogue(0, matrixA.y + matrixA.getHeight(), '',
    width, height, 32, new DrawProps(dialogueProps));

dialogueProps.text.font = monospaceFont;
var equation = new Dialogue(0, height * 3 / 4 + 28, '', width, height, 32,
    new DrawProps(dialogueProps));

dialogueProps.text.size = 40;
dialogueProps.text.halign = RIGHT;
dialogueProps.text.valign = BOTTOM;
dialogueProps.fillColor.a = 0;
var actionDialogue = new Dialogue(width - 24, height - 8, '→',
    undefined, undefined, 0, new DrawProps(dialogueProps));


// *****************************************************************************
// Scene management ************************************************************
// *****************************************************************************
var BASE_DURATION = 300;
var tweener = new Tweener();
var currentScene = -1; // We have not started our first scene, yet

var scenes = [
    function() {
        dialogue.message = 'Suppose we want to multiply two matrices.';

        tweener.to(actionDialogue, BASE_DURATION * 4,
                'x', actionDialogue.x + 12)
            .then(actionDialogue, BASE_DURATION * 4,
                'x', actionDialogue.x, true);

        // Prep positioning
        var position = matrixProduct.getEntryPosition(0, 0);
        highlightProduct.x = position.x;
        highlightProduct.y = position.y;
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
];

// `params` properties:
//     .row (required)
//     .column (required)
//     .dialogue (required, but each sub-property is optional)
//         .start
//         .firstEntryOfA
//         .firstEntryOfB
//         .moveInward
//         .nextEntryOfA
//         .nextEntryOfB
//         .preResult
//         .result
//         .end
var scenesForProductEntry = function(params) {
    return [
        function() {
            // Highlight position in product matrix
            if (params.dialogue.start) {
                dialogue.message = params.dialogue.start;
            }
            var position = matrixProduct.getEntryPosition(params.row,
                params.column);
            tweener.to(highlightProduct, BASE_DURATION, 'x', position.x);
            tweener.to(highlightProduct, BASE_DURATION, 'y', position.y);
            if (params.row === 0 && params.column === 0) {
                tweener.to(highlightProduct.drawProps.fillColor, BASE_DURATION,
                    'a', 255);
            }
        },
        function() {
            // Highlight first part of calculation in A
            if (params.dialogue.firstEntryOfA) {
                dialogue.message = params.dialogue.firstEntryOfA;
            }
            equation.message = '(' + matrixA.getEntry(params.row, 0) + ' x ';
            var position = matrixA.getEntryPosition(params.row, 0);
            highlightA.x = position.x;
            highlightA.y = position.y;
            tweener.to(highlightA.drawProps.fillColor, BASE_DURATION, 'a', 255);
        },
        function() {
            // Highlight first part of calculation in B
            if (params.dialogue.firstEntryOfB) {
                dialogue.message = params.dialogue.firstEntryOfB;
            }
            equation.message += matrixB.getEntry(0, params.column) + ')';
            var position = matrixB.getEntryPosition(0, params.column);
            highlightB.x = position.x;
            highlightB.y = position.y;
            tweener.to(highlightB.drawProps.fillColor, BASE_DURATION, 'a', 255);
        },
        function() {
            // Move highlights inward for A and B
            if (params.dialogue.moveInward) {
                dialogue.message = params.dialogue.moveInward;
            }
            equation.message += ' + ';
            var positionA = matrixA.getEntryPosition(params.row, 1);
            tweener.to(highlightA, BASE_DURATION, 'x', positionA.x);
            var positionB = matrixB.getEntryPosition(1, params.column);
            tweener.to(highlightB, BASE_DURATION, 'y', positionB.y);
        },
        function() {
            // Emphasize highlight for next part of calculation in A
            if (params.dialogue.nextEntryOfA) {
                dialogue.message = params.dialogue.nextEntryOfA;
            }
            equation.message += '(' + matrixA.getEntry(params.row, 1);
            tweener.to(highlightA, BASE_DURATION, 'radius', highlightA.radius + 10);
        },
        function() {
            // Emphasize highlight for next part of calulcation in B
            if (params.dialogue.nextEntryOfB) {
                dialogue.message = params.dialogue.nextEntryOfB;
            }
            equation.message += ' x ' +matrixB.getEntry(1, params.column) + ')';
            tweener.to(highlightA, BASE_DURATION, 'radius', highlightA.radius - 10);
            tweener.to(highlightB, BASE_DURATION, 'radius', highlightB.radius + 10);
        },
        function() {
            // Focus on where result will go in product matrix
            if (params.dialogue.preResult) {
                dialogue.message = params.dialogue.preResult;
            }
            equation.message += ' = ';
            tweener.to(highlightB, BASE_DURATION, 'radius', highlightB.radius - 10);
            tweener.to(highlightA.drawProps.fillColor, BASE_DURATION, 'a', 0);
            tweener.to(highlightB.drawProps.fillColor, BASE_DURATION, 'a', 0);
        },
        function() {
            // Display result in product matrix
            if (params.dialogue.result) {
                dialogue.message = params.dialogue.result;
            }
            var result = matrixDataProduct[params.row][params.column];
            matrixProduct.setEntry(params.row, params.column, result);
            equation.message += result;
            tweener.to(highlightProduct, BASE_DURATION,
                'radius', highlightProduct.radius + 10);
        },
        function() {
            // Prepare for next stage of sequence
            if (params.dialogue.end) {
                dialogue.message = params.dialogue.end;
            }
            equation.message = '';
            tweener.to(highlightProduct, BASE_DURATION,
                'radius', highlightProduct.radius - 10);
        }
    ];
};

var scenesForFirstProduct = scenesForProductEntry({
    row: 0,
    column: 0,
    dialogue: {
        start: 'Now, we want to determine the first value.',
        firstEntryOfA: 'So, we multiply the first entry on the left...',
        firstEntryOfB: 'By the top entry above.',
        moveInward: 'Then move inward.',
        preResult: 'Which produces',
        end: 'Now, repeat the process.',
    },
});

var scenesForSecondProduct = scenesForProductEntry({
    row: 0,
    column: 1,
    dialogue: {
        preResult: 'Which produces',
        end: 'Repeat this for the bottom row.',
    },
});

var scenesForThirdProduct = scenesForProductEntry({
    row: 1,
    column: 0,
    dialogue: {
        preResult: 'Which produces',
        end: 'Repeat this one last time.',
    },
});

var scenesForLastProduct = scenesForProductEntry({
    row: 1,
    column: 1,
    dialogue: {
        preResult: 'Which produces',
        end: 'You\'re done!',
    },
});

scenes = scenes
    .concat(scenesForFirstProduct)
    .concat(scenesForSecondProduct)
    .concat(scenesForThirdProduct)
    .concat(scenesForLastProduct);

var nextScene = function() {
    if (currentScene < scenes.length - 1) {
        currentScene++;

        if (currentScene < scenes.length - 1) {
            cursor(HAND);
            tweener.to(actionDialogue.drawProps.fillColor, 0, 'a', 0)
                .then(actionDialogue.drawProps.fillColor, 2000, 'a', 0)
                .then(actionDialogue.drawProps.fillColor, 2000, 'a', 75);
        } else {
            cursor('DEFAULT');
            tweener.fastForward();
            tweener.to(actionDialogue.drawProps.fillColor, 0, 'a', 0);
        }

        scenes[currentScene]();
    }
};

// TODO Determine whether it's possible for a mouseClicked callback
//      to be invoked in the middle of a draw invocation.  If so,
//      The next scene should be scheduled, instead of immediately
//      adjusted.
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

/*
░░░░░░░░░░░░░░░░░░░░░
░░░░░░▄▀▀▄▀▀▄░░░░░░░░
░░░░░█▒▄░▄░░▒█▄▄▄░░░░
░░░▄▄█░▀░▀░░░█▄▓▓█░░░
░▄▀▒▒▒▀▄▀▄▄▄▀▒▒▀█▓▄░░░
▄▀▀▒▀▒▒▒▒▒░░░▒▒▒█▓▓█░░░
█▒▒▒▒▒▒▒▒▄░░░░▒▒██▀░░░░
▀▄▒▒▒▒▒▒▒█▀░░▒▄█▄▀░░░░░
░░▀▀▄▄▄▄█▄░░▒▒▀▄█▄▄░░░
*/
