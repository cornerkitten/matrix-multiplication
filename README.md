# Matrix Multiplication

> Visualize the basics of matrix Multiplication


## Khan Academy

This app was developed on the Khan Academy (KA) coding platform, using their environment which includes a JavaScript port of Processing.  If you are curious,  feel free to check out the [live demo](https://www.khanacademy.org/computer-programming/matrix-multiplication/6191097875857408 "Matrix Multiplication on Khan Academy").


## Features

 - Animation through a lightweight Tweener class.  Capabilities include chaining and repeating tweens.  Tweener also provides the ability to "fast-forward" all open tweens to their final ending values.

 - MatrixView class for displaying matrices (of any n x m size) with their conventional braces.  Unfortunately, although this class supports n x m matrices, parts of the remaining app cater specifically to 2 x 2 matrices, for simplicity reasons.

 - Scene sequencing.  The scenes are progressed by the user simply left clicking anywhere within the app display.  If the user pauses on a scene for more than a moment, a subtle arrow will appear to remind the user they may continue.

 - Separation of concerns using prototypal classes.  The KA platform only supports a single textbox/file for source code.  But, ideally, these classes would be separated out into their own modules/files.


## Build

In order to conform to the community guidelines on Khan Academy, the recommended approach would be to visit the [original project](https://www.khanacademy.org/computer-programming/matrix-multiplication/6191097875857408 "Matrix Multiplication on Khan Academy"), then select "Spin-off".  At this point, you can run and experiment with your own copy of Matrix Multiplication.


## Considerations

Note that this app uses a number of global functions/variables, as this is conventional to the environment it was written for.  For example, the Processing function `fontSize()` is available in the global context and will likewise apply the font size change to the global drawing state.


## Author
Sam (aka CornerKitten)


## License
[MIT license](https://opensource.org/licenses/mit-license.php)
