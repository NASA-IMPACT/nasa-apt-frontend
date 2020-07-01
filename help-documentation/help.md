# User Guide for Authoring ATBDs using the Algorithm Publication Tool (APT)

## 1. Introduction
The Algorithm Publication Tool (APT) is a cloud-based publication tool developed within NASA’s Earth Science Data Systems (ESDS) program that standardizes Algorithm Theoretical Basis Documents (ATBDs) content, streamlines the authoring process of ATBDs, and allows the science community to search and retrieve ATBDs from a centralized repository. This document provides a detailed overview of APT, it’s functionality, and a guide for using APT to write, publish, and search for ATBDs.

### 1.1 ATBDs in NASA
ATBDs provide data users with the physical theory, mathematical procedures, and applied assumptions used to develop algorithms that convert radiances received by remote sensing instruments into geophysical quantities. NASA requires ATBDs for all Earth Observing System (EOS) instrument products. The goal of APT is to provide a comprehensive authoring, review, and publication service for NASA, which includes a centralized repository for published documents. APT provides a standardized content template to remove confusion and uncertainty around ATBD content requirements. This standardization further ensures each NASA data product corresponds to a single ATBD. Furthermore, modernization of ATBDs through APT, in which the content is reconceptualized as metadata, supports easy and rapid updates of content, centralizes ATBDs in a single location improving end user search and discover, and promotes both human and machine content parsing to streamline data understanding.

### 1.2 Components of the Algorithm Publication Tool
The main goal of APT is to modernize NASA Earth science documentation by developing a web-based interface to address scientific documentation needs by standardizing and simplifying the process of writing, publishing, and searching for ATBDs. This is partially accomplished by moving from a static to dynamic model of documentation with intelligent connections to software, data, and other supporting resources to improve transparency and promote scientific reproducibility. APT provides a single-entry point for writing and updating ATBDs and a centralized document repository to enable users to access and view ATBDs (Figure 1).

<figure>
  <img src='https://raw.githubusercontent.com/bwbaker1/APT_Images/master/Figure1_APT_components.png' alt='Figure 1' />
  <figcaption>
    Figure 1. APT Components: an ATBD metadata model, database and front-end tool, and centralized repository for finding ATBDs.
  </figcaption>
</figure>

The three components of the APT include a metadata model, front-end tool and supporting content database, and document repository. First, the APT envisions ATBDs as structured metadata and not just documents. This means that component metadata is reusable across different ATBDs, which promotes consistency and standardization while reducing human input. For example, the APT encourages authors to use existing data, such as citation information, instead of manually inputting this information in an ATBD. Thus, this reduces the potential for errors. Also, data products and source code are often dynamic, yet it is difficult to update static documents. Another benefit of the metadata model is that it makes information dynamic so that it is easier to update ATBDs. Finally, the metadata model provides ATBDs in machine readable formats which increases the discoverability of these documents.

The second component of the APT is the database and front-end tool. ATBD authors use the APT’s cloud-based authoring tool to write new documents and to edit existing documents. The front-end authoring tool guides users through the ATBD authoring process in a series of organized steps. This assists authors in providing the necessary content, reduces the need to organize and structure documents, and promotes standardization across ATBDs. Content entered into this tool is saved into a database the structure of which is defined by the ATBD metadata model. This database infrastructure supports the reuse of content across documents. Once created, the front-end feature provides two options to preview documents, including HTML and PDF.

Currently, end users often find searching for and discovering existing ATBDs challenging. Thus, the final component of APT is the establishment of a centralized repository and discovery portal [in work]. Searching for ATBDs through the repository utilizes both identifying metadata (e.g., reference information and science keywords) and document content (e.g., equations and scientific concepts). The repository and search capabilities increase the discoverability of ATBDs. Last, a goal of this component is to integrate existing NASA ATBDs into the centralized repository. Integration of all ATBDs will increase the search and discoverability of not only new ATBDs but existing ones as well.

## 2. The Algorithm Publication Tool
This section provides explanations of the features of the APT, namely the ATBD authoring process, searching and discovering documents and content through the centralized ATBD repository

### 2.1 Main Landing Page
This section provides an overview and describes APT’s pages and features (Figure 2).

<figure>
  <img src='https://raw.githubusercontent.com/bwbaker1/APT_Images/master/Figure2_LandingPage.png' alt='Figure 2' />
  <figcaption>
    Figure 2. Overview of APT’s landing page. Note: Outlined and labelled pages and features correspond to the numbered descriptions in text below.
  </figcaption>
</figure>

1. NASA APT – Persistent button which redirects users to the APT landing page.
2. Documents Status – Dropdown list feature that allows users to sort on publication status. Options include All [default], draft [documents that are still in progress], or published [completed ATBDs].
3. Documents – This button redirects users to the APT User Guide and the LaTeX Help Manual for the APT.
4. About – This button redirects users to the About page that describes the APT.
5. Search Bar – This button initiates a search bar that can be used to search for existing ATBDs by title.
6. Create ATBD – This button creates a new ATBD document. The ATBD immediately becomes available for authoring.

From the APT Landing Page, users have three main navigation options:
1. create new ATBDs (section 2.2);
2. edit existing ATBDs;
3. search, discover, and view ATBDs (section 2.3).

### 2.2 Writing an ATBD Using APT
The APT’s authoring pages support fast navigation through the two features shown in Figure 3, and is described below. Also, note that the APT automatically saves ATBD drafts if an author exits the tool. However, content not saved (i.e., clicking the “Save” button) will not be automatically saved. For example, authors must click the save button after entering the ATBD title in order to save the title to the document.

<figure>
  <img src='https://raw.githubusercontent.com/bwbaker1/APT_Images/master/Figure3_ATBDWritingSteps.png' alt='Figure 3' />
  <figcaption>
    Figure 3. Navigation features associated with creating an ATBD. Note: Outlined and labelled features correspond to numbered descriptions in text below.
  </figcaption>
</figure>

1. Select Step drop down menu – The dropdown list feature allows ATBD authors to quickly navigate between APT’s seven pages.
2. Previous and Next – These buttons allow for quick navigation to the previous or next page while writing an ATBD.

The remainder of this section provides details for writing ATBDs using the APT. APT subsects writing an ATBD into seven steps (shown in Figure 3) logically grouping the content required to write an ATBD. The subsections below describe the content that authors will need to provide in each of these steps.

#### 2.2.1 Identifying Information (Step 1)
The first step prompts users to input unique information that identifies the new ATBD (Figure 4). The content provided in this section will be utilized to generate structured citations for the ATBD, and, ultimately, will be how end users come to identify the document.

<figure>
  <img src='https://raw.githubusercontent.com/bwbaker1/APT_Images/master/Figure4_IdentifyingInformation.png' alt='Figure 4' />
  <figcaption>
    Figure 4. ATBD unique identifying information. Note: Outlined and labelled features correspond to numbered descriptions in text below.
  </figcaption>
</figure>

1. Title – Authors should enter a descriptive, formal title of the ATBD. It is recommended that the title be as descriptive as possible while keeping acronyms to a minimum.
2. Save – This button saves the ATBD title. Note: the APT uses this save feature throughout the tool.
3. Information icon – This icon describes the expected information to be entered in the field. Simply hovering over the icon displays the information. Note: the APT uses this information icon throughout the tool.
4. Add a citation – This button opens a citation form. Required fields include creator(s), title, and release date. However, authors should include as much information as possible to reference the ATBD. Figure 5 shows all the fields associated with adding a citation.

<figure>
  <img src='https://raw.githubusercontent.com/bwbaker1/APT_Images/master/Figure5_Citation.png' alt='Figure 5' />
  <figcaption>
    Figure 5. ATBD citation information. Note: Outlined and labelled features correspond to numbered descriptions in text below.
  </figcaption>
</figure>

1. Creators – Enter the name of the individual(s) or organization responsible for authoring the ATBD (required field).
2. Editors – Provide the name of the individual(s) or organization responsible for editing and publishing the ATBD (optional field).
3. Title – Enter a descriptive, formal title of the ATBD. Note, the citation title and the ATBD title will be identical (required field).
4. Series Name – State the name of the series for which the ATBD belongs to (optional field).
5. Release Date – Provide the release date of the ATBD (required field). The data input in this field should be numbers.
6. Release Place – Name the release location (city if possible) of the ATBD (optional field).
7. Publisher – Provide the name of the individual(s) or organization that published the ATBD (optional field).
8. Version – Enter the ATBD version number (optional field).
9. Issue – Enter the ATBD issue number (optional field).
10. Additional Details – Authors have an option of including additional free-text information about the citation within this field (optional field).
11. Online Resource – Include a URL that directs ATBD users to the landing page of the ATBD (optional field).

#### 2.2.2 Contact Information (Step 2)
The second step requests contact information for the individual, or group, responsible for fielding user questions regarding the ATBD (Figure 6). The APT stores information from all published documents, which authors can retrieve and use in other documents. Therefore, authors have the option to search for existing contact information stored in the APT and should use this information whenever possible instead of entering information manually. This ensures that information is consistent across all documents which is an advantage of the APT.

<figure>
  <img src='https://raw.githubusercontent.com/bwbaker1/APT_Images/master/Figure6_AddContacts.png' alt='Figure 6' />
  <figcaption>
    Figure 6. Individual or group contact information. Note: Outlined and labelled features correspond to numbered descriptions in text below.
  </figcaption>
</figure>

1. Add a contact – This feature allows authors to add ATBD contact information. Once selected, users have the option to search for an existing contact or create a new contact (Figure 7).

<figure>
  <img src='https://raw.githubusercontent.com/bwbaker1/APT_Images/master/Figure7_SearchContact.png' alt='Figure 7' />
  <figcaption>
    Figure 7. Select or create a new contact. Note: Outlined and labelled features correspond to numbered descriptions in text below.
  </figcaption>
</figure>

1. Select or create contact – This opens a dropdown list feature that allows authors to either search for an existing contact or create a new one. As noted above, authors should use existing contact information whenever possible to promote consistency.
2. ontact drop down list – Search for an existing contact using the search bar or create new contact by selecting “Create new contact.” The APT automatically populates the contact information fields when authors select an existing contact. Otherwise, authors must manually enter in contact information (Figure 8a and Figure 8b).

<figure>
  <img src='https://raw.githubusercontent.com/bwbaker1/APT_Images/master/Figure8a_ContactInfo.png' alt='Figure 8a' />
  <figcaption>
    Figure 8a. Required and optional fields for creating a new ATBD contact (if type is “Person”). Note: Outlined and labelled features correspond to numbered descriptions in text below.
  </figcaption>
</figure>

1. Delete – Clicking the delete icon deletes the contact from the ATBD.
2. Type – Choose whether the contact is a Person or Group. The fields below (i.e., numbers 3-5) are available if Person (see Figure 8b for Group) is selected
3. First Name – Provide the first name of the contact person. (required field).
4. Middle Name – Enter the middle name of the contact person (optional field).
5. Last Name – Provide the last name of the contact person should be entered into this field (required field).
6. UUID – Enter the contact person’s Universally Unique Identifier (UUID). UUIDs are identification numbers that uniquely identify a person or group (optional field). The data input in this field should be a string.
7. URL – Provide a URL that is relevant for contacting the contact person (optional field).
8. Add a contact mechanism – Specify the contact individual’s, or group’s, role related to the document. Options include data center contact, technical contact, science contact, investigator, metadata author, user services and science software development (required field).
9. Create and attach contact to ATBD – This button uses the provided contact information to create the new contact and attaches this information to the ATBD.
10. Add a contact – This button creates an additional contact.

<figure>
  <img src='https://raw.githubusercontent.com/bwbaker1/APT_Images/master/Figure8b_contactinfo.png' alt='Figure 8b' />
  <figcaption>
    Figure 8b. Required and optional fields for creating a new ATBD contact (if type is “Group”). Note: Outlined and labelled features correspond to numbered descriptions in text below.
  </figcaption>
</figure>

1. Delete – Clicking the delete icon deletes the contact from the ATBD.
2. Type – Choose whether the contact is a Person or Group. The field below (i.e., number 3) is available if Group (see Figure 8a for Person) is selected
3. Group Name - Enter the name of the group (required field).
4. UUID – Enter the contact person’s Universally Unique Identifier (UUID). UUIDs are identification numbers that uniquely identify a person or group (optional field). The data input in this field should be a string.
5. URL – Provide a URL that is relevant for contacting the contact person (optional field).
6. Add a contact mechanism – Specify the contact individual’s, or group’s, role related to the document. Options include data center contact, technical contact, science contact, investigator, metadata author, user services and science software development (required field).
7. Create and attach contact to ATBD – This button uses the provided contact information to create the new contact and attaches this information to the ATBD.

#### 2.2.3 References (Step 3)
There are two options for adding references to the ATBD (Figure 9), (1) import as a Bibtex file or (2) enter the information manually.

<figure>
  <img src='https://raw.githubusercontent.com/bwbaker1/APT_Images/master/Figure9_AddReference.png' alt='Figure 9' />
  <figcaption>
    Figure 9. Two options to add references to the ATBD. Note: Outlined and labelled features correspond to numbered descriptions in text below.
  </figcaption>
</figure>

1. Upload BibTex file – This button uploads one or more references using BibTeX files (Figure 10). A BibTeX file will not upload if the file does not include the minimum required information or if the file contains an error. The required information varies by reference entry type.
2. Add a reference – This button allows authors to manually enter citation information for one or more references (Figure 11).

<figure>
  <img src='https://raw.githubusercontent.com/bwbaker1/APT_Images/master/Figure10_ImportReference.png' alt='Figure 10' />
  <figcaption>
    Figure 10. Dialog box to import a Bibtex file. Note: Outlined and labelled features correspond to numbered descriptions in text below.
  </figcaption>
</figure>

1. Choose File – To upload a BibTeX file, click on “Choose File” under the “Select a bibtex file” to import. Then, navigate to the desired BibTeX file.
2. Cancel – Clicking the “Cancel” button will stop the BibTeX file import.
3. Proceed – After selecting the Bibtex file, clicking “Proceed” imports the BibTex file into the ATBD.

<figure>
  <img src='https://raw.githubusercontent.com/bwbaker1/APT_Images/master/Figure11_ReferenceInfo.png' alt='Figure 11' />
  <figcaption>
    Figure 11. Form to manually enter reference information. Note: Outlined and labelled features correspond to numbered descriptions in text below.
  </figcaption>
</figure>

1. Title – State the title of the reference.
2. Authors – Provide the name of the author(s) of the reference.
3. Series – Name the publication series of this reference.
4. Edition – Enter the edition of the series in which the reference is published.
5. Volume – Provide the volume number of the published series.
6. Issue – Enter the issue number of the series.
7. Report Number –Enter the report number related to reference.
8. Publication Place – Name the publication location (city if possible) of the reference.
9. Year – Provide the publication year of the reference. The data input in this field should be numbers.
10. Publisher – Enter the name of the entity that published the reference.
11. Pages – Enter the page numbers associated with the reference. The data input in this field should be numbers.
12. ISBN – Provide the reference’s International Standard Book Number (ISBN). An ISBN is a 10-digit (if assigned before 2007) or 13-digit number that uniquely identifies a book title and edition. For example, ISBN: 1896522874 identifies the book Women Astronauts.
13. DOI – Enter the reference’s Digital Object Identifier (DOI). A DOI is a unique set of characters and numbers that identify a specific article, report, book, etc. For example, the DOI 10.5067/TERRA/MODIS/L3M/PAR/2018 uniquely identifies the MODIS-TERRA Level 3 Mapped Photosynthetically Available Radiation Data Version R2018.0 dataset. Note that not all references have DOIs.
14. Online Resource – Provide any online resources that are related to the reference. For example, this could include links to relevant user guides, tools, documentation, landing pages, etc. that further support the reference.
15. Other Reference Details – Provide any additional useful information about the reference.
16. Add Reference – This button adds the provided reference to the ATBD. Authors must include the reference title and publication year before this button becomes available.
17. Add a Reference – Authors have an option to add an additional reference to the ATBD by clicking on the “Add a Reference” button.

#### 2.2.4 Introduction (Step 4)
This step provides a brief introduction and historical perspective to the ATBD (Figure 12). The introduction should provide users with a concise overview of the algorithm, including its derived quantities, scientific importance, and intended applications. Authors should explain the history and foundation regarding the development of the algorithm and a brief summary of the algorithm’s output data products. End users will use this content to understand the value and applicability of this data product.
These free-text fields utilize a rich content editor that automatically formats the introduction. The APT utilizes LaTeX to build and insert tables, figures, references, and equations into these fields.

<figure>
  <img src='https://raw.githubusercontent.com/bwbaker1/APT_Images/master/Figure12_ATBDIntroduction.png' alt='Figure 12' />
  <figcaption>
    Figure 12. Introduction to the ATBD. Note: Outlined and labelled features correspond to numbered descriptions in text below.
  </figcaption>
</figure>

1. Bulleted List – This button inserts a bulleted list into the text box.
2. Numbered List – This button inserts a numbered list into the text box.
3. Insert Table – This button inserts a table into the ATBD.  An example of how to insert a table is shown below.
4. Insert Equation – This button inserts an equation into the text box. The APT uses LaTeX to create equations. Inserting equations requires that authors have knowledge of LaTeX’s mathematical commands.
5. Insert Figure – This feature allows an author to upload a figure and caption. Note that figures must be in an image format. An example of how to upload a figure is shown below.
6. Insert Reference – This button provides an option to insert an existing reference(s) or to create a new one.
7. Undo – Clicking this icon will undo the previous action.
8. Redo – Clicking this icon will redo the previous action.
9. Introduction – Enter a brief introduction to the ATBD that concisely provides users with information needed to understand the relevance and usefulness of the ATBD.
10. Save – This button saves the ATBD Introduction.
11. Historical Perspective – Provide a brief summary regarding the history of the algorithm’s development and its output data.
12. Save – This button saves the ATBD historical perspective.

#### 2.2.5 Algorithm Description (Step 5)
This step first describes the scientific and mathematical theories and assumptions associated with the algorithm(s). The scientific theory and assumptions describe the scientific background that permits deriving parameters from the observations (Figure 15). Authors should also provide the underlying mathematical logic, including any assumptions, simplifications, and approximations behind the algorithms (Figure 16). The second aspect of this step identifies the algorithm’s input and output variables, including names and units used to report these variables (Figure 17 and 18). The content provided in this step gives end users the needed information to understand the theoretical background of the algorithm(s). Note: refer to Figure 12 for descriptions of the rich content editor.

<figure>
  <img src='https://raw.githubusercontent.com/bwbaker1/APT_Images/master/Figure13_ScientificTheory.png' alt='Figure 13' />
  <figcaption>
    Figure 13. Insert the scientific theory and assumptions associated with the algorithm. Note: Outlined and labelled features correspond to the numbered descriptions in text below.
  </figcaption>
</figure>

1. Describe the Scientific Theory – Provide a description of the principles essential to the product’s retrieval. This should include a description of the physics and associated observed geophysical phenomenon.
2. Save – This button saves the description of the scientific theory to the ATBD.
3. Scientific Theory Assumptions – Describe any scientific or physical assumptions made in deriving the algorithm.
4. Save – This button saves the scientific theory assumptions to the ATBD.

<figure>
  <img src='https://raw.githubusercontent.com/bwbaker1/APT_Images/master/Figure14_MathematicalTheory.png' alt='Figure 14' />
  <figcaption>
    Figure 14. Insert the mathematical theory and assumptions associated with the algorithm. Note: Outlined and labelled features correspond to the numbered descriptions in text below.
  </figcaption>
</figure>

1. Describe the Mathematical Theory – Describe the mathematical theory that is essential to the algorithm’s development.
2. Save – This button saves the mathematical theory description to the ATBD.
3. Mathematical Theory Assumptions – Provide a description of any mathematical assumptions, simplifications, and approximations made when deriving the algorithm.
4. Save – This button saves the mathematical theory assumptions to the ATBD.

<figure>
  <img src='https://raw.githubusercontent.com/bwbaker1/APT_Images/master/Figure15_InputVariables.png' alt='Figure 15' />
  <figcaption>
    Figure 15. Variable(s) that are used in the algorithm. Note: Outlined and labelled features correspond to the numbered descriptions in text below.
  </figcaption>
</figure>

1. Name – Provide the name of the variable that is input into the algorithm as it is named in the data.
2. Long Name – Report the expanded name of the input variable.
3. Unit – Provide the unit used to report the input variable.  For example, atmospheric pressure could be reported using hectopascals (hPa).
4. Add Algorithm Variable – Clicking this button adds the provided input variable into the ATBD.

<figure>
  <img src='https://raw.githubusercontent.com/bwbaker1/APT_Images/master/Figure16_OutputVariables.png' alt='Figure 16' />
  <figcaption>
    Figure 16. Variable(s) that are used in the algorithm. Note: Outlined and labelled features correspond to the numbered descriptions in text below.
  </figcaption>
</figure>

1. Name – Provide the name of the variable that is output from the algorithm as it is named in the data.
2. Long Name – Provide the expanded name of the output variable.
3. Unit – Report the unit used to report the output variable.
4. Add Algorithm Variable – This button adds the output variable to the ATBD.

#### 2.2.6 Algorithm Usage (Step 6)
This step describes the intended use of the algorithm’s output data and the validation process to assess the quality of the algorithm(s). ATBD authors should discuss any constraints or limitations for using the output data (Figure 17). Also, provide the validation methods used to determine uncertainties and errors associated with the algorithm’s output data and report the results, including any errors and uncertainties associated with the output data (Figure 18). If known, state the source of the uncertainties. This content shows end users the reliability of the algorithm and its output data. Also, refer to Figure 12 for descriptions of the rich content editor.

<figure>
  <img src='https://raw.githubusercontent.com/bwbaker1/APT_Images/master/Figure17_AlgorithmUsage.png' alt='Figure 17' />
  <figcaption>
    Figure 17. Limitations and constraints for using the output data derived by the algorithm. Note: Outlined and labelled features correspond to numbered descriptions in text.
  </figcaption>
</figure>

1. Describe the Algorithm Constraints – Provide the constraints and limitations for using the algorithm output data.
2. Save – This button saves the described algorithm constraints.

<figure>
  <img src='https://raw.githubusercontent.com/bwbaker1/APT_Images/master/Figure18_PerformanceAssessment.png' alt='Figure 18' />
  <figcaption>
    Figure 18. Performance assessment of the algorithm. Note: Outlined and labelled features correspond to numbered descriptions in text below.
  </figcaption>
</figure>

1. Validation Methods – Describe the scientific methods utilized to validate the algorithm. The details provided should match the current algorithm’s maturity.
2. Save – This button saves the described validation method.
3. Uncertainties – Specify any errors applicable to the validation method. This may include uncertainty in scientific and mathematical methods and/or errors associated with observation retrievals.
4. Save – This button saves the described uncertainties associated with the algorithm.
5. Errors – Report the results of the algorithm validation, including statistical relationships between the algorithm output and the implemented validation.
6. Save – This button saves the described errors associated with the algorithm.

#### 2.2.7 Algorithm Implementation (Step 7)
This step discusses the process of implementing the algorithm(s) and accessing relevant data. The algorithm implementation section directs end users to the algorithm’s source code and relevant information to execute the source code (Figure 19 and 20). Similarly, provide access URLs to the algorithm’s input and output data (Figure 21 and 22) and any alternative data access mechanisms (Figure 23). This content promotes transparency and makes it possible for end users to reproduce the product. Note: refer to Figure 12 for descriptions of the rich content editor.

<figure>
  <img src='https://raw.githubusercontent.com/bwbaker1/APT_Images/master/Figure19_AlgorithmImplementation.png' alt='Figure 19' />
  <figcaption>
    Figure 19. Information related to implementing the algorithm. Note: Outlined and labelled features correspond to the numbered description in text below.
  </figcaption>
</figure>

1. Add – This button creates new fields to add information regarding algorithm implementation.

<figure>
  <img src='https://raw.githubusercontent.com/bwbaker1/APT_Images/master/Figure20_AlgorithmImplementationInfo.png' alt='Figure 20' />
  <figcaption>
    Figure 20. Algorithm implementation is described and added to the ATBD. Note: Outlined and numbered features correspond to numbered descriptions in text below.
  </figcaption>
</figure>

1. URL – Provide an URL that directs users to the algorithm implementation source code.
2. Description – Describe relevant information needed to execute the algorithm implementation source code. This may include, but not be limited to, execution instructions, memory requirements, programming languages, and dependencies.
3. Save – This button saves the algorithm implementation to the ATBD.

<figure>
  <img src='https://raw.githubusercontent.com/bwbaker1/APT_Images/master/Figure21_DataAccessInput.png' alt='Figure 21' />
  <figcaption>
    Figure 21. Data input access is added to the ATBD. Note: Outlined and numbered features correspond to numbered descriptions in text below.
  </figcaption>
</figure>

1. URL – Provide an algorithm data input access URL into this field. This should link to data input and used in the algorithm.
2. Description – Enter a description of the method to access the data.
3. Save – This button saves the input data access URL and description to the ATBD.
4. Add – This button allows for additional access URLs to the algorithm data inputs to be included in the ATBD. Provide access to all the data inputs used in the algorithm(s).

<figure>
  <img src='https://raw.githubusercontent.com/bwbaker1/APT_Images/master/Figure22_DataAccessOutput.png' alt='Figure 22' />
  <figcaption>
    Figure 22. Data output access is added to the ATBD. Note: Outlined and numbered features correspond to numbered descriptions in text below.
  </figcaption>
</figure>

1. URL – Add an algorithm output data access URL into this field. This should link to the output data from the algorithm.
2. Description – Enter a brief description of the data access method. This should provide context for users on how to access the data.
3. Save – This button saves the output data access URL and description to the ATBD.
4. Add – This button allows for additional data access output URLs to be included in the ATBD.  Be sure to include all output data from the algorithm(s).

<figure>
  <img src='https://raw.githubusercontent.com/bwbaker1/APT_Images/master/Figure23_DataAccessRelatedURLs.png' alt='Figure 23' />
  <figcaption>
    Figure 23. New data access related URLs added to the ATBD. Note: Outlined and numbered features correspond to numbered descriptions in text below.
  </figcaption>
</figure>

1. URL – Enter alternative data access mechanisms, such as links to machine services, ordering services, and DAAC websites into this field.
2. Description – Enter a brief description of the provided alternative data access URL.
3. Save – This button saves the data access related URL to the ATBD.
4. Add – This button allows any additional related URLs to be entered into the ATBD.

#### 2.2.8 Inserting Tables and Uploading Figures
A LaTeX backend enables entry of rich content (e.g., tables, figures, references, and equations) that is necessary for scientific writing. Figures 24 and 25 show examples of inserting tables and uploading figures into an ATBD, respectively, using the APT’s rich content editor. Inserting tables and figures is a relatively straightforward process; however, inserting equations using the equation editor requires knowledge of LaTeX mathematical commands. For guidance on inserting equations in the APT, see the “LaTeX Help Manual for the Algorithm Publication Tool (APT).” The use of a LaTeX backend allows authors to focus on writing scientific content and not formatting the document.

<figure>
  <img src='https://raw.githubusercontent.com/bwbaker1/APT_Images/master/Figure24_FigureUpload.png' alt='Figure 24' />
  <figcaption>
    Figure 24. Insert tables using the rich content editor. Note: Outlined and labelled features correspond to numbered descriptions in text below.
  </figcaption>
</figure>

1. Insert Table – This button inserts a table into the ATBD.
2. Add/Remove Rows – The minus sign (-) removes a row from the table while the plus sign (+) adds a row to the table.
3. Table – Insert desired content into the cells of a table. Use the rich content editor to include additional content such as lists and bullets.
4. Add/Remove Columns – The minus sign (-) removes a column from the table while the plus sign (+) adds a column to the table.
5. Delete – Clicking this icon deletes the table.
6. Save – Clicking this button saves the content into the ATBD.

<figure>
  <img src='https://raw.githubusercontent.com/bwbaker1/APT_Images/master/FIgure25_InsertingTable.png' alt='Figure 25' />
  <figcaption>
    Figure 25. Upload figures using the rich content editor. Note: Outlined and labelled features correspond to numbered descriptions in text below.
  </figcaption>
</figure>

1. Upload an Image – Use this button to select the desired figure(s) to upload.  Note that the figure must be in an image format.
2. Image Caption – Enter the desired figure caption in this box.
3. Place – This button uploads and places the figure into the ATBD.

#### 2.2.9 Editing and Publishing ATBDs
Navigating back to the Documents page after creating an ATBD provides additional actions that are described below (Figure 26). These include viewing ATBD status, titles, authors, and document actions (e.g., viewing, editing, publishing and deleting documents). Selecting an ATBD provides another set of features, including additional options, PDF downloading, and document editing (Figure 27). These actions allow ATBD authors to quickly perform additional actions on their documents.

<figure>
  <img src='https://raw.githubusercontent.com/bwbaker1/APT_Images/master/Figure26_DocumentActions.png' alt='Figure 26' />
  <figcaption>
    Figure 26. Actions to perform on created ATBDs. Note: Outlined and labelled features correspond to numbered descriptions in text below.
  </figcaption>
</figure>

1. Status – This feature describes the current status of the ATBD.  Options include draft [document still in progress] or published [document is complete].
2. Title – This feature displays the title of the ATBD.
3. Menu icon – Clicking on this icon displays a dropdown list of actions to potentially perform on the document (see list of actions below).
4. Document Actions – Dropdown list feature of actions that authors can perform on the ATBD. The options include view, edit, publish, or delete the ATBD.

<figure>
  <img src='https://raw.githubusercontent.com/bwbaker1/APT_Images/master/Figure27_ViewingDocument.png' alt='Figure 27' />
  <figcaption>
    Figure 27. Options for creating ATBDs. Note: Outlined and labelled features correspond to numbered descriptions in text below.
  </figcaption>
</figure>

1. Viewing Document – This feature describes the current status of ATBD. Options include draft [documents that are still in progress] or published [completed ATBDs].
2. Options – This button opens a dropdown feature list that includes duplicate the document, get the document citation, or delete the document.
3. Download PDF – This button downloads the ATBD as a PDF.
4. Edit – This button allows authorized authors to edit an existing ATBD.
