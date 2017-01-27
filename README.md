
TODO
 - Link to Khan Academy project
     https://www.khanacademy.org/computer-programming/matrix-multiplication/6191097875857408
 - Include background

 - How to run

 - Screenshot

 - Development Notes
     - Khan Academy sandbox uses global functions to manipulate properties
       such as font size, fill color, and stroke.  To alleviate the issues
       that comes from updating these shared properties, a DrawProps class was
       created
     - For simplicity, most code has been written with the assumption that
       valid input will be received.

 - Configuration
     - You may change the data for the matrix multiplication operands A & B
       (i.e. `matrixDataA` and `matrixDataB`).  This includes altering the sizes
       of the matrices.  However, there are a few constraints:
        - The size of A must be compatible with the size of B for matrix
          multiplication
        - Nevermind.  Because of how the scenes are generated, the sizes
          currently must remain fixed at 2 x 2
