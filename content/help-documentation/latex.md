---
title: Latex
---
# LaTeX Help Manual for the Algorithm Publication Tool (APT)

## Getting Started with Inserting Equations in APT via LaTeX Commands

[[toc]]

## 1. Introduction
LaTeX is a markup language that simplifies the formatting process for technical and scientific documents. A big effort often involved in writing scientific documents using common word processors is that authors must manually format documents. This process can be cumbersome and frustrating especially when authoring large technical and scientific documents. The advantage of LaTeX’s typesetting system is that it simplifies the formatting process by applying correct typography to the document, thus producing consistent, well-structured documents. This means that authors can focus on writing content instead of document design and formatting. 

LaTeX supports the scientific writing needs of the NASA Earth and atmospheric science community by providing citation styling, table construction, the ability to insert and format figures, and write complex equations, while supporting common advanced typesetting services (bold, italics, bullets, numbering, etc.). Despite the advantages of LaTeX, there can be a learning curve for beginners. Therefore, the Algorithm Publication Tool’s (APT) user interface (UI) is designed to hide many of the pain points of LaTeX to support a simplified and standardized user experience, both for authors and the end user community. This guide serves to introduce authors writing Algorithm Theoretical Basis Documents (ATBDs) to using LaTeX within APT. 

[[Back to top](#)]

## 2. Using LaTeX in APT
As noted in the previous section, the APT authoring tool hides most LaTeX interactions from authors by providing simple user interfaces to format citations, tables, and figures (see the [Algorithm Publication Tool (APT) user guide](https://www.earthdata.nasa.gov/apt/user-guide/apt)). A major advantage of LaTeX is the ability of content writers to easily compile complex mathematical equations into a technical or scientific document. This functionality can not be concisely contained within a Graphical User Interface (GUI), and therefore the burden falls upon the authors to write, in LaTeX, mathematical equations. 

Using LaTeX in APT, authors may include mathematical equations inline within a paragraph, or on a standalone line using an equation editor. A simple button is available for authors to insert equations within a document and formatting is handled internally. This section describes the basic LaTeX commands authors may use to build equations within APT. 

[[Back to top](#)]

### 2.1 Building Mathematical Equations within APT
While most LaTeX interactions are hidden in APT, inline and block equation insertions are the exception. Thus, ATBD authors must use LaTeX commands to write and display mathematical equations. APT provides an equation editor (Figure 1), which opens as a free-text field for inserting equations using LaTeX commands. This feature allows users to select whether to insert an inline or block equation. Inline equations appear within the text of the document. Block equations are sectioned away from the text, which increases the readability of complex equations within a document. Block equations are sequentially numbered in the ATBD. This section describes the basic commands for writing equations in APT.

![Figure 1](https://github.com/bwbaker1/APT_Images/blob/master/figure1_equation_editor_annotated.png?raw=true "Figure 1. APT equation editor.")

![Figure 2](https://github.com/bwbaker1/APT_Images/blob/master/figure2_latex_cheatsheet_annotated.png?raw=true "Figure 2. A selected portion of the LaTeX cheat sheet.")

[[Back to top](#)]

### 2.2 Inserting Inline Equations
As previously noted, inline equations are rendered within the text of the document. However, we strongly encourage that only simple mathematical expressions and equations be provided inline within the text, such as “y=mx+b” or “x2.” To insert an inline equation within a document, first click within the document where you want to insert the equation. Next, click the equation button from the rich text editor (Figure 3). Clicking the equation button opens the equation editor. To insert an inline equation, select the “Inline” radial button on the equation editor (Figure 4). LaTeX commands begin with a backslash “\” symbol, which automatically populates within the equation editor. If an equation does not begin with a command (e.g., /frac), either remove the backslash or provide a space between the backslash and the equation, such as “\ y=mx+b.” This tells LaTeX that the first character is not a command.

Figure 5 shows an example of inserting a simple equation into the text within a document. Figures 6 and 7 show examples of how APT renders inline equations in APT and on a PDF. An inserted equation can be edited or deleted by clicking on the inserted equation and using the equation options feature (Figure 8).

![Figure 3](https://github.com/bwbaker1/APT_Images/blob/master/figure3_equation_button_annotated.png?raw=true "Figure 3. APT equation button that opens the equation editor.")

1. **Equation button** -- This button opens up the equation editor.

![Figure 4](https://github.com/bwbaker1/APT_Images/blob/master/figure4_inline_equation_annotated.png?raw=true "Figure 4. APT equation editor with the inline equation radial button selected.")

1. **Inline equation** -- Select "Inline" to insert an equation within the text of the document.

![Figure 5](https://github.com/bwbaker1/APT_Images/blob/master/figure5_insert_inline_equation_annotated.png?raw=true "Figure 5. Add a simple equation into the equation editor that will be inserted inline within the text.")

1. **Equation** -- Free-text field to add LaTeX commmands to build an equation.
2. **Preview** -- The rendered equation is displayed in this field.
3. **Insert** -- Clicking this button inserts the equation.

![Figure 6](https://github.com/bwbaker1/APT_Images/blob/master/figure6_inline_equation_apt_annotated.png?raw=true "Figure 6. Example of an inline equation that was inserted within the text in the APT interface.")

![Figure 7](https://github.com/bwbaker1/APT_Images/blob/master/figure7_inline_equation_pdf_annotated.png?raw=true "Figure 7. Example of an inline equation that was rendered in a PDF.")

![Figure 8](https://github.com/bwbaker1/APT_Images/blob/master/figure8_edit_equation_annotated.png?raw=true "Figure 8. Inserted equations can be edited or deleted.")

1. **Edit** -- This button allows a user to edit the equation.
2. **Delete** -- Clicking this button deletes the equation.
3. **Inserted equation** -- Display of the inserted equation in APT. Click on the equation to open up the equation options. 

[[Back to top](#)]

### 2.3 Inserting Block Equations
Block equations are displayed sectioned away from the text. To insert a block equation,  click the “equation” button in the desired location and select the “Block” radial button (Figure 9). The process for inserting a block equation is the same as inserting an inline equation, except the “block” radial button must be selected from the equation editor. Figure 10 shows how to insert an equation on its own line, which will render the following on the APT interface and the ATBD PDF (Figures 11 and 12). As previously noted, equations can be edited or deleted using the equation options (see Figure 8).

![Figure 9](https://github.com/bwbaker1/APT_Images/blob/master/figure9_insert_block_equation_annotated.png?raw=true "Figure 9. APT equation editor with the Block equation radial button selected.")

1. **Block equation** -- Select "Block" to insert an equation that is sectioned away from the text.

![Figure 10](https://github.com/bwbaker1/APT_Images/blob/master/figure10_blockequation_annotated.png?raw=true "Figure 10. Writing expressions using the equation editor displays the equation sectioned away from the text.")

1. **Equation** -- Free-text field to add LaTeX commands to build an equation.
2. **Preview** -- The rendered equation is displayed in this field.
3. **Insert** -- Clicking this button inserts the equation.

![Figure 11](https://github.com/bwbaker1/APT_Images/blob/master/figure11_blockequation_apt_annotated.png?raw=true "Figure 11. Example of a block equation inserted within the APT interface.")

![Figure 12](https://github.com/bwbaker1/APT_Images/blob/master/figure12_blockequation_pdf_annotated.png?raw=true "Figure 12. Example of a bloack equation rendered on a PDF.")

The following examples demonstrate how to insert or use common elements found in equations. The LaTeX Help References section provides additional resources for using LaTeX to write mathematical equations.

[[Back to top](#)]

#### 2.3.1 Superscripts and Subscripts
Superscripts and subscripts are easily inserted into equations by using the underscore “_” and hat “^” symbols, respectively. For example, “ x^2” and “ 2_a” render “x2” and “2a” in the equation. Figures 13 and 14 indicate how to add a superscript and subscript to an equation.

![Figure 13](https://github.com/bwbaker1/APT_Images/blob/master/figure13_superscripts.png?raw=true "Figure 13. Example of inserting a superscript using the equation editor.")

![Figure 14](https://github.com/bwbaker1/APT_Images/blob/master/figure14_subscripts.png?raw=true "Figure 14. Example of inserting a subscript using the equation editor.")

[[Back to top](#)]

#### 2.3.2 Brackets and Parentheses
LaTeX includes several types of brackets and parentheses that can be inserted in an equation. Figures 15-17 show the commands for adding brackets and parentheses, and how these are rendered in the ATBD. Users control the size of brackets and parentheses (Figure 18; see LaTeX Help References in the next section for more sizing options). 

![Figure 15](https://github.com/bwbaker1/APT_Images/blob/master/figure15_roundedparentheses.png?raw=true "Figure 15. Example commands for inserting rounded parentheses into an equation.")

![Figure 16](https://github.com/bwbaker1/APT_Images/blob/master/figure16_curlybrackets.png?raw=true "Figure 16. Example commands for inserting curly brackets into an equation.")

![Figure 17](https://github.com/bwbaker1/APT_Images/blob/master/figure17_doubleverticalbars.png?raw=true "Figure 17. Example commands for inserting double vertical bars into an equation.")

![Figure 18](https://github.com/bwbaker1/APT_Images/blob/master/figure18_anglebrackets.png?raw=true "Figure 18. Example commands for inserting angled brackets into an equation.")

![Figure 19](https://github.com/bwbaker1/APT_Images/blob/master/figure19_Bigbrackets.png?raw=true "Figure 19. The “\Big \Big” command increases the size of the brackets. LaTeX supports several commands for controlling the size of parentheses and brackets.")

[[Back to top](#)]

#### 2.3.3 Fractions and Bionomial Coefficients
A fraction represents the number of parts of a whole and includes a numerator on top and a denominator on bottom. Fractions are inserted using the “\frac { }{ }” command and enclosing the numerator and denominator each in a pair of brackets. A binomial coefficient is the number of ways to choose a subset from a larger set and is inserted using “\binom { }{ }.” Figures 20 and 21 show examples of inserting fractions and binomial coefficients, and how these are rendered in an ATBD. 

![Figure 20](https://github.com/bwbaker1/APT_Images/blob/master/figure20_fractions.png?raw=true "Figure 20. Commands for inserting a fraction into an equation.")

![Figure 21](https://github.com/bwbaker1/APT_Images/blob/master/figure21_biomcoeffiecients.png?raw=true "Figure 21. Commands for inserting binomial coefficients into an equation.")

[[Back to top](#)]

#### 2.3.4 Operators
Mathematical operators are symbols that represent processes used to solve mathematical problems. Mathematical terms are typically rendered in italics, but using the operator commands renders operators in Roman characters. Figures 22 and 23 show a few examples of inserting operators (see LaTeX Help References in the next section for more operators).

![Figure 22](https://github.com/bwbaker1/APT_Images/blob/master/figure22_sincosin.png?raw=true "Figure 22. Commands for inserting sine and cosine into an equation.")

![Figure 23](https://github.com/bwbaker1/APT_Images/blob/master/figure23_logarithm.png?raw=true "Figure 23. Commands for inserting logarithmic operators in an equation. LaTeX supports many more mathematical operators.")

[[Back to top](#)]

#### 2.3.5 Integrals, Sum and Product
Integrals determine areas and volumes, and are denoted by the integral symbol. The “\int_{lower}^{upper}” command inserts integrals into an equation. The sum and product symbols indicate to sum or multiply the terms in an equation, respectively. Similar to integrals, the command for inserting sum and product expressions is “\sum{upper}^{lower}” and “\prod_{upper}^{lower}.” Figures 24-26 provide examples for integral, sum, and product commands, and how these symbols are rendered in the ATBD.

![Figure 24](https://github.com/bwbaker1/APT_Images/blob/master/figure24_intergal.png?raw=true "Figure 24. Example of inserting an integral symbol into the equation editor.")

![Figure 25](https://github.com/bwbaker1/APT_Images/blob/master/figure25_sum.png?raw=true "Figure 25. Example of inserting the sum symbols into the equation editor.")

![Figure 26](https://github.com/bwbaker1/APT_Images/blob/master/figure26_product.png?raw=true "Figure 26. Example of inserting a product symbol into the equation editor.")

[[Back to top](#)]

#### 2.3.6 Greek Letter and Math Symbols
Greek letters and math symbols are used to denote various constants and values. The commands to insert these symbols include a backslash “\” and the abbreviation of the letter or symbol name. Figures 27-30 provide a few example commands to insert Greek letters and math symbols (see LaTeX Help References in the next section for a full list of Greek letters and math symbols).

![Figure 27](https://github.com/bwbaker1/APT_Images/blob/master/figure27_pi.png?raw=true "Figure 27. LaTeX provides many Greek and mathematical symbols that can be inserted in an equation. Example shown for inserting the Greek letter pi.")

![Figure 28](https://github.com/bwbaker1/APT_Images/blob/master/figure28_omega.png?raw=true "Figure 28. LaTeX provides many Greek and mathematical symbols that can be inserted in an equation. Example shown for inserting the Greek letter omega.")

![Figure 29](https://github.com/bwbaker1/APT_Images/blob/master/figure29_infinity.png?raw=true "Figure 29. LaTeX provides many Greek and mathematical symbols that can be inserted in an equation. Example shown for inserting the mathematical symbol for infinity.")

![Figure 30](https://github.com/bwbaker1/APT_Images/blob/master/figure30_triangle.png?raw=true "Figure 30. LaTeX provides many Greek and mathematical symbols that can be inserted in an equation. Example shown for inserting the mathematical symbol for a triangle.")

[[Back to top](#)]

#### 2.3.7 Insert Complex Equations
Thus far, this guide has shown how to insert simple mathematical expressions and symbols into an ATBD. However, the main advantage of utilizing LaTeX to build equations within ATBDs is the ease of inserting complex equations. Examples of equations with varying complexity are shown in figures 31-33. Note that the command “\textrm{}” renders the term without italicization. Figure 34 shows the complex Clausius-Clapeyron equation. 

![Figure 31](https://github.com/bwbaker1/APT_Images/blob/master/figure31_equationofstate.png?raw=true "Figure 31. Example of a more complex equation: equation of state. ")

![Figure 32](https://github.com/bwbaker1/APT_Images/blob/master/figure32_corioliseffect.png?raw=true "Figure 32. Example of a more complex equation: Coriolis Effect. ")

![Figure 33](https://github.com/bwbaker1/APT_Images/blob/master/figure33_potentialtemp.png?raw=true "Figure 33. Example of a more complex equation: potential temperature.")

![Figure 34](https://github.com/bwbaker1/APT_Images/blob/master/figure37_fullequation.png?raw=true "Figure 34. Example shows the Clausius-Clapeyron equation inserted into the equation editor.")

[[Back to top](#)]

## 3. LaTeX Help References
LaTeX Math and Equations. (2017, October 7). LaTeX-tutorial.com. https://www.latex-tutorial.com/tutorials/amsmath/

Mathematical Expressions. (2023). Overleaf. https://www.overleaf.com/learn/latex/Mathematical_expressions 

[[Back to top](#)]
