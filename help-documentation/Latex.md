---
title: Latex
---
# LaTeX Help Manual for the Algorithm Publication Tool (APT)

## 1. Introduction
LaTeX is a typesetting system used for authoring technical and scientific documents. A big effort often involved in writing scientific documents using common word processors is that authors must manually format documents. This process can be cumbersome and frustrating especially when authoring large technical and scientific documents. The advantage of LaTeX’s typesetting system is that it simplifies the formatting process by applying correct typography to the document, thus producing consistent, well-structured documents. This means that authors can focus on writing content instead of document design and formatting. 

LaTeX supports the scientific writing needs of the NASA Earth and atmospheric science community by providing citation styling, table construction, the ability to insert and format figures, and write complex equations, while supporting common advanced typesetting services (bold, italics, bullets, numbering, etc.). Despite the advantages of LaTeX, there can be a learning curve for beginners. Therefore, the APT user interface (UI) is designed to hide many of the pain points of LaTeX to support a simplified and standardized user experience, both for authors and the end user community. This guide serves to introduce authors writing Algorithm Theoretical Basis Documents (ATBDs) to using LaTeX within the Algorithm Publication Tool (APT). 

## 2. Using LaTeX in APT
As noted in the previous section, the APT authoring tool hides most LaTeX interactions from authors by providing simple user interfaces to format citations, tables, and figures (see the Algorithm Publication Tool (APT) User Guide). A major advantage of LaTeX is the ability of content writers to easily compile complex mathematical equations into a technical or scientific document. This functionality can not be concisely contained within a Graphical User Interface (GUI), and therefore the burden falls upon the authors to write, in LaTeX, mathematical equations. Authors may include mathematical equations inline within a paragraph, or on a standalone line using an equation editor. However, a simple button is available for authors to insert equations within a document and formatting is handled internally. This section describes the basic LaTeX commands authors may use to build equations within the APT. 

### 2.1 Building Mathematical Equations within APT
While most LaTeX interactions are hidden in the APT, inline and separate equation insertions are the exception. Thus, ATBD authors must use LaTeX commands to write and display mathematical equations. This section describes the basic commands for writing equations in the APT.

### 2.2 Inserting Equations Inline
Providing the “$” character enters into LaTeX’s mathematical mode, which is possible to do within text. Equations are inserted inline in the text by enclosing the expression with “$.” However, we strongly encourage that only simple mathematical expressions and equations be provided inline within the text, such as “y=mx+b” or “x2.” Figure 1 shows how to insert a simple equation inline within the paragraph while figure 2 displays how this equation will render in an ATBD PDF file. 

<figure>
  <img src='https://raw.githubusercontent.com/bwbaker1/APT_Images/master/Latex_Fig1_inlineEquation.png' alt='Figure 1' />
  <figcaption>
    Figure 1. Enclosing an equation in “$” inserts an expression or equation inline within the paragraph.
  </figcaption>
</figure>

<figure>
  <img src='https://raw.githubusercontent.com/bwbaker1/APT_Images/master/Latex_Fig2_InlineExample.png' alt='Figure 2' />
  <figcaption>
    Figure 2. Example of inline equation in ATBD PDF file. 
  </figcaption>
</figure>

### 2.3 Inserting Equations Using the Equation Editor
Authors will most often insert equations using the APT’s equation editor. The equation editor opens as a new, free-text field for inserting equations using LaTeX commands. This feature renders equations sectioned away from the text which increases the readability of complex equations within a document. Each inserted equation is sequentially numbered in the ATBD.

Equations can also be displayed sectioned away from the text by clicking the “equation” button in the desired location to insert an equation (Figure 3). LaTeX commands begin with a backslash “\” symbol, which automatically populates within the equation editor. If an equation does not begin with a command (e.g., /frac), either remove the backslash or provide a space between the backslash and the equation, such as “\ y=mx+b.” This tells LaTeX that the first character is not a command. Figure 4 shows how to insert an equation on its own line which will render the following in the ATBD (Figure 5).

<figure>
  <img src='https://raw.githubusercontent.com/bwbaker1/APT_Images/master/Latex_Fig3_EquationEditor.png
' alt='Figure 3' />
  <figcaption>
    Figure 3. The APT’s equation editor.
  </figcaption>
</figure>

<figure>
  <img src='https://raw.githubusercontent.com/bwbaker1/APT_Images/master/Latex_Fig4_Equation.png' alt='Figure 4' />
  <figcaption>
    Figure 4. Writing expressions using the equation editor displays the equation sectioned away from the text.
  </figcaption>
</figure>

<figure>
  <img src='https://raw.githubusercontent.com/bwbaker1/APT_Images/master/Latex_Fig5_EquationEditorPDF.png' alt='Figure 5' />
  <figcaption>
    Figure 5. Example of a rendered equation inserted using the APT’s equation editor.
  </figcaption>
</figure>

The following examples demonstrate how to insert or use common elements found in equations. The LaTeX Help References section provides additional resources for using LaTeX to write mathematical equations.

#### 2.3.1 Superscripts and Subscripts
Superscripts and subscripts are easily inserted into equations by using the underscore “_” and hat “^” symbols, respectively. For example, “\ x^2” and “\ 2_a” renders “x2” and “2a” in the equation. Figure 6 indicates how to add a superscript and subscript to an equation.

<figure>
  <img src='https://raw.githubusercontent.com/bwbaker1/APT_Images/master/Latex_Fig6_superscriptsSubscripts.png' alt='Figure 6' />
  <figcaption>
    Figure 6. Examples for inserting superscripts and subscripts into a document using the APT.
  </figcaption>
</figure>

#### 2.3.2 Brackets and Parentheses
LaTeX includes several types of brackets and parentheses that can be inserted in an equation. Figure 7 shows the commands for adding brackets and parentheses, and how these are rendered in the ATBD. Users control the size of brackets and parentheses (Figure 8; see LaTeX Help References in the next section for more sizing options). 

<figure>
  <img src='https://raw.githubusercontent.com/bwbaker1/APT_Images/master/Latex_Fig7_bracketsParenthesis.png' alt='Figure 7' />
  <figcaption>
    Figure 7. Example commands for inserting several types of parentheses and brackets into an equation.
  </figcaption>
</figure>

<figure>
  <img src='https://raw.githubusercontent.com/bwbaker1/APT_Images/master/Latex_Fig8_bracketsBig.png' alt='Figure 8' />
  <figcaption>
    Figure 8. The “\Big \Big” command increases the size of the brackets. LaTeX supports several commands for controlling the size of parentheses and brackets.
  </figcaption>
</figure>

#### 2.3.3 Fractions and Bionomial Coefficients
A fraction represents the number of parts of a whole and includes a numerator on top and a denominator on bottom. Fractions are inserted using the “\frac { }{ }” command and enclosing the numerator and denominator each in a pair of brackets. A binomial coefficient is the number of ways to choose a subset from a larger set and is inserted using “\binom { }{ }.” Figure 9 shows examples of inserting fractions and binomial coefficients, and how these are rendered in an ATBD. 

<figure>
  <img src='https://raw.githubusercontent.com/bwbaker1/APT_Images/master/Latex_Fig9_fractionsBinomials.png
' alt='Figure 9' />
  <figcaption>
    Figure 9. Commands for inserting fractions and binomial coefficients into an equation.
  </figcaption>
</figure>

#### 2.3.4 Operators
Mathematical operators are symbols that represent processes used to solve mathematical problems. Mathematical terms are typically rendered in italics, but using the operator commands renders operators in Roman characters. An operator command includes a backslash followed by the operator abbreviation, such as “\sin” for the sine operator. Figure 10 shows a few examples of inserting operators (see LaTeX Help References in the next section for more operators).

<figure>
  <img src='https://raw.githubusercontent.com/bwbaker1/APT_Images/master/Latex_Fig10_Operators.png' alt='Figure 10' />
  <figcaption>
    Figure 10. Commands for inserting sine, cosine, and logarithmic operators in an equation. LaTeX supports many more mathematical operators.
  </figcaption>
</figure>

#### 2.3.5 Integrals, Sum and Product
Integrals determine areas and volumes, and are denoted by the integral symbol. The “\int_{lower}^{upper}” command inserts integrals into an equation. The sum and product symbols indicate to sum or multiply the terms in an equation, respectively. Similar to integrals, the command for inserting sum and product expressions is “\sum{upper}^{lower}” and “\prod_{upper}^{lower}.” Figure 11 provides examples for integral, sum, and product commands, and how these symbols are rendered in the ATBD.

<figure>
  <img src='https://raw.githubusercontent.com/bwbaker1/APT_Images/master/Latex_Fig11_Integrals_sums.png
' alt='Figure 11' />
  <figcaption>
    Figure 11. Examples of inserting integral, sum, and product symbols in the APT.
  </figcaption>
</figure>

#### 2.3.6 Greek Letter and Math Symbols
Greek letters and math symbols are used to denote various constants and values. The commands to insert these symbols includes a backslash “\” and the abbreviation of the letter or symbol name. Figure 12 provides a few example commands to insert Greek letters and math symbols (see LaTeX Help References in the next section for a full list of Greek letters and math symbols).

<figure>
  <img src='https://raw.githubusercontent.com/bwbaker1/APT_Images/master/Latex_Fig12_GreekMathSymbols.png' alt='Figure 12' />
  <figcaption>
    Figure 12. LaTeX provides many Greek and mathematical symbols that can be inserted in an equation. A few example commands and renderings are shown in this figure.
  </figcaption>
</figure>

#### 2.3.7 Insert Complex Equations
Thus far, this guide has shown how to insert simple mathematical expressions and symbols into an ATBD. However, the main advantage of utilizing LaTeX to build equations within ATBDs is the ease of inserting complex equations. Examples of equations with varying complexity are shown in Figure 13. Note that the command “\textrm{}” renders the term without italicization. Figure 14 provides a step-by-step guide to inserting the Clausius-Clapeyron equation. 

<figure>
  <img src='https://raw.githubusercontent.com/bwbaker1/APT_Images/master/Latex_Fig13_ComplexEquations.png' alt='Figure 13' />
  <figcaption>
    Figure 13. Examples of inserting more complex equations.
  </figcaption>
</figure>

<figure>
  <img src='https://raw.githubusercontent.com/bwbaker1/APT_Images/master/Latex_Fig14_ClausisuClapeyron.png' alt='Figure 14' />
  <figcaption>
    Figure 14. APT supports insertion of complex equations using LaTeX commands. Shown here is a term-by-term breakdown for inserting the Clausius-Clapeyron equation into an ATBD using the APT.
  </figcaption>
</figure>

## 3. LaTeX Help References
LaTeX Math and Equations. (2017, October 7). LaTeX-tutorial.com. https://www.latex-tutorial.com/tutorials/amsmath/

Mathematical Expressions. (2020). Overleaf. https://www.overleaf.com/learn/latex/Mathematical_expressions 
