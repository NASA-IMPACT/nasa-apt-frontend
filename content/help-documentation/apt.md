---
title: APT
---
# Algorithm Publication Tool (APT)

## 1. Introduction

The Algorithm Publication Tool (APT) is a cloud-based publication tool developed within NASA’s Earth Science Data Systems (ESDS) program that standardizes Algorithm Theoretical Basis Documents (ATBDs) content, streamlines the authoring process of ATBDs, and allows the science community to search and retrieve ATBDs from a centralized repository. This document provides a detailed overview of the APT, it’s functionality, and a guide for using the APT to write, publish, and search for ATBDs.

### 1.1 ATBDs in NASA

ATBDs provide data users with the physical theory, mathematical procedures, and applied assumptions used to develop algorithms that convert radiances received by remote sensing instruments into geophysical quantities. NASA requires ATBDs for all Earth Observing System (EOS) instrument products. The goal of the APT is to provide a comprehensive authoring, review, and publication service for NASA, which includes a centralized repository for published documents. The APT provides a standardized content template to remove confusion and uncertainty around ATBD content requirements. This standardization further ensures each NASA data product corresponds to a single ATBD. Furthermore, modernization of ATBDs through the APT, in which the content is reconceptualized as metadata, supports easy and rapid updates of content, centralizes ATBDs in a single location improving end user search and discover, and promotes both human and machine content parsing to streamline data understanding. 

### 1.2 Components of the Algorithm Publication Tool

The main goal of the APT is to modernize NASA Earth science documentation by developing a web-based interface to address scientific documentation needs by standardizing and simplifying the process of writing, publishing, and searching for ATBDs. This is partially accomplished by moving from a static to dynamic model of documentation with intelligent connections to software, data, and other supporting resources to improve transparency and promote scientific reproducibility. APT provides a single-entry point for writing and updating ATBDs and a centralized document repository to enable users to access and view ATBDs (Figure 1). 

![Figure 1](https://github.com/bwbaker1/APT_Images/blob/master/figure1.png?raw=true "Figure 1. APT components: an ATBD metadata model, database and front-end tool, and centralized repository for finding ATBDs.")

The three components of the APT include a metadata model, front-end tool and supporting content database, and document repository. First, the APT envisions ATBDs as structured metadata and not just documents. This means that component metadata is reusable across different ATBDs, which promotes consistency and standardization while reducing human input. For example, the APT encourages authors to use existing data, such as citation information, instead of manually inputting this information into an ATBD. Thus, this reduces the potential for errors. Also, data products and source code are often dynamic, yet it is difficult to update static documents. Another benefit of the metadata model is that it makes information dynamic so that it is easier to update ATBDs. Finally, the metadata model provides ATBDs in machine readable formats which increases the discoverability of these documents.

The second component of the APT is the database and front-end tool. ATBD authors use the APT’s cloud-based authoring tool to write new documents and to edit existing documents. The front-end authoring tool guides users through the ATBD authoring process in a series of organized steps. This assists authors in providing the necessary content, reduces the need to organize and structure documents, and promotes standardization across ATBDs. Content entered into this tool is saved into a database the structure of which is defined by the ATBD metadata model. This database infrastructure supports the reuse of content across documents. Once created, the front-end feature provides two options to preview documents, including HTML and PDF.

Currently, end users often find searching for and discovering existing ATBDs challenging. Thus, the final component of the APT is the establishment of a centralized repository and discovery portal. Searching for ATBDs through the repository utilizes both identifying metadata (e.g., reference information and science keywords) and document content (e.g., equations and scientific concepts). The repository and search capabilities increase the discoverability of ATBDs. Last, a goal of this component is to integrate existing NASA ATBDs into the centralized repository. Integration of all ATBDs will increase the search and discoverability of not only new ATBDs but existing ones as well.

## 2. The Algorithm Publication Tool

This section provides explanations of the features of the APT and describes the process of authoring, searching, and discovering documents and content through the centralized ATBD repository. 

### 2.1 Main Landing Page and User Login

This section provides an overview and describes the APT’s pages and login process (Figure 2).

![Figure 2](https://github.com/bwbaker1/APT_Images/blob/master/figure2_annotation.png?raw=true "Figure 2 Overview of APT’s landing page. Outlined and labelled pages and features correspond to the numbered descriptions in text below. NASA APT – Persistent button which redirects users to the APT landing page.")

1. **NASA APT** - Persistent button which redirects users to the APT landing page.
Welcome –  This button redirects users to the APT landing page.
2. **Documents** –  This button redirects users to the APT’s Documents page that contains all published ATBDs.
About – This button redirects users to the About page that describes the APT.
3. **Help** – This button redirects users to the Help Center for the APT.
4. **Feedback** – This button toggles a form where users can submit feedback regarding the APT (Figure 3).
Sign in – This button redirects users to the APT’s sign in page. 
5. **Learn more** – This button redirects users to the APT’s About page.
6. **Explore the documents** – This button redirects users to the APT’s Documents page.

![Figure 3](https://github.com/bwbaker1/APT_Images/blob/master/figure3_annotation.png?raw=true "Figure 3 The APT utilizes the Earth Science Data and Information System’s (ESDIS) feedback module to allow users to provide feedback. Outlined and labelled pages and features correspond to the numbered descriptions in text below. ")

1. **Subject** – Briefly describe the subject of this feedback submission.
2. **Details** – Use this text box to provide specific details regarding the feedback.
3. **Name** – Provide your first and last name.
4. **Email** – Enter your email address so that the APT team can contact you if needed.
5. **Attachment** – Button that allows users to attach files (note: only specific file types are allowed). 
6. **I’m not a robot** – Checking the box “I’m not a robot” distinguishes between humans and bots and helps protect the APT from spam and abuse.
7. **Submit** – Clicking this button will submit your feedback to the APT team.  

Any users can navigate to the APT and can search for and view published ATBDs. However, only authorized and authenticated users can create or edit an ATBD. Therefore, users must first create an account with the APT (Figure 4). The APT utilizes Amazon Web Services Cognito for authorization and authentication. Once the account is created, a notification will be sent to the APT curator who will then authorize and authenticate the user using Cognito.  After approval, the user must sign in (Figure 5) to create new ATBDs or view and edit ATBDs that they are associated with. 

![Figure 4](https://github.com/bwbaker1/APT_Images/blob/master/figure4_annotation.png?raw=true "Figure 4 Prompt to create a new account with APT. Outlined and labelled pages and features correspond to the numbered descriptions in text below. ")

1. **Email** – Enter the full email address that will be associated with the new APT account. 
2. **Preferred username** – Enter the preferred username for the account. 
3. **Password** – Enter a password that will be used to sign into the APT account.
4. **Sign up** – ​Click this button to create the new account.

![Figure 5](https://github.com/bwbaker1/APT_Images/blob/master/figure5_annotation.png?raw=true "Figure 5 The APT’s sign in page. Outlined and labelled pages and features correspond to the numbered descriptions in text below.")

1. **Email**  – Enter the email associated with the account.
2. **Password** – Enter the password associated with the account.
3. **Forgot your password** – This button redirects users to a prompt to reset a forgotten password.
4. **Sign In** – Click this button to log into the APT.
5. **Sign up** – This link prompts users to create an account.

### 2.2 Approved User Dashboard

A user will be redirected to their user dashboard once successfully logged into the APT (Figure 6). This dashboard is where the user will be able to create, edit, and view their ATBDs. A user has two possible roles on an ATBD inclusing (1) lead author or (2) contributing author. A user can navigate through the following documents tabs within the user dashboard including leading, contributions, reviews, and public. This section describes the tabs, pages, and features of the user dashboard. 

![Figure 6](https://github.com/bwbaker1/APT_Images/blob/master/figure6_annotation.png?raw=true "Figure 6 Successful login. Outlined and labelled pages and features correspond to the numbered descriptions in text below.")

1. **Dashboard** – This button redirects users to their dashboard that contains all published ATBDs and ATBDs associated with the logged in user (Figure 7-10).  New ATBDs can be created from the page.
2. **Contacts** – This button redirects users to the Contacts page which lists all contacts stored within the APT and allows users to create new contact(s) (see section 2.2.1).
3. **About** – This button redirects users to the About page that describes the APT.
4. **Help** – This button redirects users to the Help Center for the APT (see section 2.2.2).
5. **Feedback** – This button toggles a form where users can submit feedback regarding the APT (see Figure 3).
6. **Username and profile** – The username appears upon successful login to the APT. This dropdown provides two options; view the user’s profile or sign out of the APT.

![Figure 7](https://github.com/bwbaker1/APT_Images/blob/master/figure7_annotation.png?raw=true "Figure 7 User dashboard lead author tab. Outlined and labelled pages and features correspond to the numbered descriptions in text below.")

1. **Create** – This button creates a new ATBD.  By default, a user becomes the lead author when they create a new ATBD.
2. **Documents tab** – These tabs allow a user to quickly navigate and see all of their documents.  The leading tab shows a user all of the ATBDs that they are the lead author on. The contributions tab shows a user all of the documents that they are a contributor on. The reviews tab navigates a user to see all of the ATBDs that they are currently a reviewer on. The public tab navigates a user to see all of their published ATBDs.
3. **Status filter** – Feature that allows users to filter their ATBDs by current status (e.g., all, draft, in review, in publication, and published). 
4. **Order** – Feature that allows users to sort their ATBDs either by most recent, alphabetical, or actionable. 
5. **Documents** – This displays all documents within the current tab (i.e., leading, contribution, review, and public). The following information is shown for each document including title, version, status, last update date and time, lead author and contributors, and comments. In this example, the leading tab is selected.
6. **Request review** – This button sends a review request to the APT’s curator. Upon review, the curator will either accept or reject the review request.  If accepted, the ATBD will move into the review process.
7. **Request publication** – This button sends a publication request to the APT’s curator. Upon review, the curator will either accept or reject the publication request. Note that an ATBD must first go through the review process and the review must be closed by the curator before the option to request publication will appear within the dashboard. 
8. **Actions** – This button brings up the options dropdown feature.
9. **Options** – Actions that can be performed on an ATBD as the lead author, including view information, edit, change lead author, draft a new major version, update minor version, and delete. Note that the options to draft a new major or minor version will only be available for a published ATBD. 

![Figure 8](https://github.com/bwbaker1/APT_Images/blob/master/figure8_annotation.png?raw=true "Figure 8 User dashboard contributions author tab. Outlined and labelled feature corresponds to the numbered descriptions in text below. See figure 7 for a detailed description of all features. ")

1. **Documents** – This displays all documents within the current documents tab (i.e., leading, contribution, review, and public). In this example, the contributions tab is selected.
2. **Options** – Actions that can be performed on an ATBD as a contributing author on an ATBD, which includes view information, edit, and update minor version.  

![Figure 9](https://github.com/bwbaker1/APT_Images/blob/master/figure9_annotation.png?raw=true "Figure 9 User dashboard reviews tab. See figure 7 for a detailed description of all features.  ")

1. **Documents** – This displays all documents within the current documents tab (i.e., leading, contribution, review, and public). In this example, the reviews tab is selected.

![Figure 10](https://github.com/bwbaker1/APT_Images/blob/master/figure10_annotation.png?raw=true "Figure 10 User dashboard public tab. See figure 7 for a detailed description of all features.  ")

1. **Documents** – This displays all documents within the current documents tab (i.e., leading, contribution, review, and public). In this example, the public tab is selected.

#### *2.2.1 Contacts Page*

The contacts page lists all of the contacts stored within the APT’s database.  All authors have access to this stored contact information so that contacts can easily be added to documents. This saves authors time and promotes consistently among ATBDs.  If a contact does not exist, users can create one from this page (Figure 11 and 12). Users also have the option to edit existing contacts. This section describes adding contacts from the contact page, where section 2.3.2 describes adding contacts to an ATBD. 

![Figure 11](https://github.com/bwbaker1/APT_Images/blob/master/figure11_annotation.png?raw=true "Figure 11 The APT’s Contacts page. Outlined and labelled pages and features correspond to the numbered descriptions in text below. ")

1. **Create** – This button redirects a user to create a new contact.
2. **Open Dropdown** – This opens up the Options dropdown feature.
3. **Options** – This feature allows users to edit or delete a selected contact.

![Figure 12](https://github.com/bwbaker1/APT_Images/blob/master/figure12_annotation.png?raw=true "Figure 12 Create a new contact. Outlined and labelled pages and features correspond to the numbered descriptions in text below.")

1. **Save** – This button saves content entered into the new contact.  Note that a prompt will appear if there is unsaved content.
2. **First name** – Enter the first name of the contact (required).
3. **Middle name** – Optionally enter the middle name of the contact.
4. **Last name** – Enter the last name of the contact (required).
5. **Uuid** – Enter the universally unique identifier (uuid) for the new contact.
6. **URL** – Enter the URL that is relevant to contacting the contact person.
7. **Contact mechanism type** – Select the contact mechanism type from the dropdown list (required).
8. **Contact mechanism value** – Enter the contact value associated with the contact mechanism (required). 
9. **Add a new contact mechanism** – The button creates an additional contact mechanism type and value.

#### *2.2.2 Help Center*

User documentation is found in the APT’s Help Center. The documentation provides help on using the APT and LaTeX (Figure 13).

![Figure 13](https://github.com/bwbaker1/APT_Images/blob/master/figure13_annotation.png?raw=true "Figure 13 Help center for APT user documentation. Outlined and labelled pages and features correspond to the numbered descriptions in text below.")

1. **Sections** – Dropdown list feature that allows users to select between help documentation. Options include ATBD creation and Latex.

### 2.3 Creating, Editing, and Writing ATBDs Using the APT

Users can create a new ATBD or edit an existing one (Figure 14) from the users dashboard. This section describes the process of creating, editing, and writing ATBDs using the APT.

![Figure 14](https://github.com/bwbaker1/APT_Images/blob/master/figure14_annotation.png?raw=true "Figure 14 Creating or editing an ATBD. Users can create new ATBDs or edit existing ATBDs that they are associated with. Outlined and labelled pages and features correspond to the numbered descriptions in text below.")

1. **Create** – The button creates a new ATBD. Users will be prompted with an information box when they create a new ATBD (Figure 15).
2. **Open Dropdown** – Clicking and opening this dropdown menu for a specific ATBD allows the user to select edit. This will open the ATBD in edit mode (Figure 16). 

![Figure 15](https://github.com/bwbaker1/APT_Images/blob/master/figure15_annotation.png?raw=true "Figure 15 Prompt that appears when a user creates a new ATBD.")

1. **Understood** – Users must click this button stating that they understand the ATBD creation process when creating a new ATBD.

![Figure 16](https://github.com/bwbaker1/APT_Images/blob/master/figure16_annotation.png?raw=true "Figure 16 ATBD viewing and editing modes. Outlined and labelled pages and features correspond to the numbered descriptions in text below.")

1. **Mode** – Dropdown feature that allows users to toggle between viewing and editing mode. Note that edits can only be made in editing mode. 

The APT’s authoring pages support fast navigation using a dropdown feature shown in Figure 17 and is described below.

![Figure 17](https://github.com/bwbaker1/APT_Images/blob/master/figure17_annotation_test.png?raw=true "Figure 17 Navigation feature associated with creating an ATBD. Outlined and labelled features correspond to numbered descriptions in text below.")

1. **Document Information** – This features shows the ATBD title, version number, status (e.g., draft, review, or published), and allows a user to toggle between editing and viewing mode.  Note that a user can only make edits while in editing mode. 
2. **Select step drop down menu** – The dropdown list feature allows ATBD authors to quickly navigate between the APT’s eight pages.

The remainder of this section provides details for writing ATBDs using the APT. The APT subsects writing an ATBD into eight steps (shown in Figure 17) logically grouping the content required to write an ATBD. The subsections below describe the content that authors will need to provide in each of these steps. See section 2.2.9 for help with using the APT’s rich content editor used for formatting content and for inserting equations, tables, and images.

Each step of the APT includes a global save button that must be clicked on in order for content to be saved (Figure 18). Note that newly added content will not be automatically saved when a user navigates away from the current step. Users will be prompted that there is unsaved content.

![Figure 18](https://github.com/bwbaker1/APT_Images/blob/master/figure18_annotation.png?raw=true "Figure 18 The APT’s global save button. ")

1. **Global save** – Persistent button saves all newly added content for the current step. Users are prompted if there is unsaved content. 

#### *2.3.1 Identifying Information (Step 1)*

The first step prompts users to input unique information that identifies the new ATBD (Figure 19a). The content provided in this section will be utilized to generate structured citations for the ATBD (Figure 20), and, ultimately, will be how end users come to identify the document.

![Figure 19a](https://github.com/bwbaker1/APT_Images/blob/master/figure19a_annotation.png?raw=true "Figure 19a ATBD unique identifying information. Outlined and labelled features correspond to numbered descriptions in text below. ")

1. **Comments** – This button opens comments for this section of the ATBD (Figure 19b). This is a persistent feature through each step.
2. **Information** – This icon describes what content should be provided in the current text field. This is a persistent feature within the APT. 
3. **Title** – Authors should enter a descriptive, formal title of the ATBD. It is recommended that the title be as descriptive as possible while keeping acronyms to a minimum.
4. **Alias** – Authors should enter an alias title for the ATBD. Once an ATBD is completed, the alias will not be editable.
5. **DOI** – Enter the digital object identifier (DOI) associated with this ATBD. The DOI is assigned by the APT curator.
6. **Section progress** – Toggle feature that allows authors to mark the section as complete or incomplete. This is a persistent feature through each step.
7. **Version description** – Author should provide a meaningful description of how this APT ATBD version differs from previous versions. This is only important for new major versions of the ATBD.

![Figure 19b](https://github.com/bwbaker1/APT_Images/blob/master/figure19b_annotation.png?raw=true "Figure 19b Comments section. Outlined and labelled features correspond to numbered descriptions in text below.")

1. **Comment filter** – User can filter document comments by all, resolved, unresolved and by the document section (e.g., Contacts).
2. **Comment** – Provide a comment related to the ATBD.
3. **Post** – This button posts the comment.

![Figure 20](https://github.com/bwbaker1/APT_Images/blob/master/figure20_annotation.png?raw=true "Figure 20 ATBD citation information. Outlined and labelled features correspond to numbered descriptions in text below.")

1. **Authors** – Enter the name of the individual(s) or organization responsible for authoring the ATBD (required field).
2. **Editors** – Provide the name of the individual(s) or organization responsible for editing and publishing the ATBD (optional field).
3. **Publisher** – Provide the name of the individual(s) or organization that published the ATBD (optional field).
4. **Release Date** – Provide the release date of the ATBD (required field). The data input in this field should be numbers.
5. **Version** – Enter the ATBD version number (optional field).
6. **Online Resource** – Include a URL that directs ATBD users to the landing page of the ATBD (optional field).

#### *2.3.2 Contact Information (Step 2)*

The second step requests contact information for the individual, or group, responsible for fielding user questions regarding the ATBD (Figure 21). The APT stores information from all published documents, which authors can retrieve and use in other documents. Therefore, authors have the option to search for existing contact information stored in the APT and should use this information whenever possible instead of entering information manually. This ensures that information is consistent across all documents which is an advantage of the APT.

![Figure 21](https://github.com/bwbaker1/APT_Images/blob/master/figure21_annotation.png?raw=true "Figure 21 Individual or group contact information. Outlined and labelled features correspond to numbered descriptions in text below.")

1. **Add a contact** – This feature allows authors to add ATBD contact information. Once selected, users have the option to search for an existing contact or create a new contact (Figure 22).

![Figure 22](https://github.com/bwbaker1/APT_Images/blob/master/figure22_annotation.png?raw=true "Figure 22 Select or create a new contact. Outlined and labelled features correspond to numbered descriptions in text below.")

1. **Delete** – Clicking the delete icon deletes the contact from the ATBD. This is a persistent feature within the APT.
2. **Select contact** – This opens a dropdown list feature that allows authors to either search for an existing contact or create a new one (Figure 23). As noted above, authors should use existing contact information whenever possible to promote consistency.
3. **Add new contact** – This button allows authors to insert an additional contact.

![Figure 23](https://github.com/bwbaker1/APT_Images/blob/master/figure23_annotation.png?raw=true "Figure 23 Required and optional fields for creating a new ATBD contact (if type is “Person”).  Outlined and labelled features correspond to numbered descriptions in text below.")

1. **Create new contact** – Dropdown menu that allows authors to select an existing contact or to create a new one.
2. **First Name** – Provide the first name of the contact person. (required field).
Middle Name – Enter the middle name of the contact person.
3. **Last Name** – Provide the last name of the contact person should be entered into this field (required field). 
4. **UUID** – Enter the contact person’s Universally Unique Identifier (UUID). UUIDs are identification numbers that uniquely identify a person or group. The data input in this field should be a string.
5. **URL** – Provide a URL that is relevant for contacting the contact person.
6. **Add a contact mechanism type** – Dropdown menu that allows authors to select the contact mechanism type (required field).
7. **Add contact mechanism value** – Enter the contact value associated with the contact mechanism such as number, email, or URL (required field). The value should match the chosen contact mechanism type. 
8. **Add a new contact mechanism** – The button creates an additional contact mechanism type and value.
9. **Contact roles** – Select the contact’s role related to the ATBD.
10. **Add new** – This button adds another contact to the ATBD.

#### *2.3.3 References (Step 3)* 

There are two options for adding references to the ATBD (Figure 24), (1) import as a BibTeX file or (2) enter the information manually. 

![Figure 24](https://github.com/bwbaker1/APT_Images/blob/master/figure24_annotation.png?raw=true "Figure 24 Two options to add references to the ATBD. Outlined and labelled features correspond to numbered descriptions in text below.")

1. **Add a reference** – This button allows authors to manually enter citation information for one or more references (Figure 25).
2. **Upload BibTeX file** – This button uploads one or more references using BibTeX files. A BibTeX file will not upload if the file does not include the minimum required information or if the file contains an error. The required information varies by reference entry type. 
3. **Actions** – Dropdown feature that allows users to select between manually adding a new reference, uploading a BibTeX file, or deleting a selected reference. 

![Figure 25](https://github.com/bwbaker1/APT_Images/blob/master/figure25_annotation.png?raw=true "Figure 25 Form to manually enter reference information. Outlined and labelled features correspond to numbered descriptions in text below.")

1. **Reference filter** – An ATBD’s references can be filtered by all, none, or unused.  
2. **Select Ref** – This is a check box that when checked selects a specific reference. 
3. **Title** – State the full title of the referenced document.
4. **Authors** – Provide the name of the author(s) (in order) or the group that authored the referenced material.
5. **Series** – Provide the name of the publication series of this reference.
6. **Edition** – Enter the edition of the series in which the reference is published. 
7. **Volume** – Provide the volume number of the published series.
8. **Issue** – Enter the issue number of the series.
9. **Report Number** –Enter the report number related to reference.
10. **Publication Place** – Name the publication location (city if possible) of the reference.
11. **Year** – Provide the publication year of the reference. The data input in this field should be numbers.
12. **Publisher** – Enter the name of the entity that published the reference.
13. **Pages** – Enter the page numbers associated with the reference. The data input in this field should be numbers.
14. **ISBN** – Provide the reference’s International Standard Book Number (ISBN). An ISBN is a 10-digit (if assigned before 2007) or 13-digit number that uniquely identifies a book title and edition. For example, ISBN: 1896522874 identifies the book Women Astronauts.
15. **DOI** – Enter the reference’s Digital Object Identifier (DOI). A DOI is a unique set of characters and numbers that identify a specific article, report, book, etc. For example, the DOI 10.5067/TERRA/MODIS/L3M/PAR/2018 uniquely identifies the MODIS-TERRA Level 3 Mapped Photosynthetically Available Radiation Data Version R2018.0 dataset. Note that not all references have DOIs.
16. **Online Resource** – Provide any online resources that are related to the reference. For example, this could include links to relevant user guides, tools, documentation, landing pages, etc. that further support the reference. 
17. **Other Reference Details** – Provide any additional useful citation information about the reference.
18. **Add a Reference** – Authors have an option to manually add another reference.
19. **Import BibTeX file** – Authors have an option to add another reference by uploading a BibTeX file.

#### *2.3.4 Introduction (Step 4)*

This step provides a brief introduction and background to the ATBD (Figure 26 and 27). The introduction should provide users with a concise overview of the algorithm, including its derived quantities, scientific importance, and intended applications. Authors should explain the history and foundation regarding the development of the algorithm and a brief summary of the algorithm’s output data products. End users will use this content to understand the value and applicability of this data product.

These free-text fields utilize a rich content editor that automatically formats the introduction. The APT utilizes LaTeX to build and insert tables, figures, references, and equations into these fields.

![Figure 26](https://github.com/bwbaker1/APT_Images/blob/master/figure26_annotation.png?raw=true "Figure 26 Introduction to the ATBD. Outlined and labelled features correspond to numbered descriptions in text below.")

1. **Introduction** – Provide a description of the ATBD which concisely gives users the information needed to understand the relevance and usefulness of the ATBD.

![Figure 27](https://github.com/bwbaker1/APT_Images/blob/master/figure27_annotation.png?raw=true "Figure 27 Background to the ATBD. Outlined and labelled features correspond to numbered descriptions in text below.")

1. **Historical perspective** – Provide a brief summary regarding the history of the algorithm’s development and its output data.
2. **Additional information** – Provide any additional information that is relevant to the background of the ATBD.

#### *2.3.5 Algorithm Description (Step 5)*

This step first describes the scientific and mathematical theories and assumptions associated with the algorithm(s). The scientific theory and assumptions describe the scientific background that permits deriving parameters from the observations (Figure 28). Authors should also provide the underlying mathematical logic, including any assumptions, simplifications, and approximations behind the algorithms (Figure 29). The second aspect of this step identifies the algorithm’s input and output variables, including names and units used to report these variables (Figures 30-32). The content provided in this step gives end users the needed information to understand the theoretical background of the algorithm(s). Note: refer to Figure 23 for descriptions of the rich content editor.

![Figure 28](https://github.com/bwbaker1/APT_Images/blob/master/figure28_annotation.png?raw=true "Figure 28 Insert the scientific theory and assumptions associated with the algorithm. Outlined and labelled features correspond to the numbered descriptions in text below.")

1. **Describe the scientific theory** – Provide a description of the principles essential to the product’s retrieval. This should include a description of the physics and associated observed geophysical phenomenon.
2. **Scientific theory assumptions** – Describe any scientific or physical assumptions made in deriving the algorithm.

![Figure 29](https://github.com/bwbaker1/APT_Images/blob/master/figure29_annotation.png?raw=true "Figure 29 Insert the mathematical theory and assumptions associated with the algorithm. Outlined and labelled features correspond to the numbered descriptions in text below.")

1. **Describe the mathematical theory** – Describe the mathematical theory that is essential to the algorithm’s development. 
2. **Mathematical theory assumptions** – Provide a description of any mathematical assumptions, simplifications, and approximations made when deriving the algorithm.

![Figure 30](https://github.com/bwbaker1/APT_Images/blob/master/figure30_annotation.png?raw=true "Figure 30 Add input and output variables used and generated by the algorithm. Outlined and labelled features correspond to the numbered descriptions in text below.")

1. **Add a new input variable** – This button adds a new input variable used in the algorithm.
2. **Add a new output variable** – This button adds a new output variable used in the algorithm.

![Figure 31](https://github.com/bwbaker1/APT_Images/blob/master/figure31_annotation.png?raw=true "Figure 31 Variable(s) that are used in the algorithm. Outlined and labelled features correspond to the numbered descriptions in the text below.")

1. **Add table caption** – Provide an appropriate input table caption.
2. **Name** – Provide the name of the variable that is input into the algorithm as it is named in the data.
3. **Long name** – Report the expanded name of the input variable.
4. **Unit** – Provide the unit used to report the input variable.  For example, atmospheric pressure could be reported using hectopascals (hPa).
5. **Add algorithm variable** – Clicking this button adds the provided input variable into the ATBD.

![Figure 32](https://github.com/bwbaker1/APT_Images/blob/master/figure32_annotation.png?raw=true "Figure 32 Variable(s) that are generated by the algorithm. Outlined and labelled features correspond to the numbered descriptions in the text below.")

1. **Add table caption** – Provide an appropriate input table caption.
2. **Name** – Provide the name of the variable that is output from the algorithm as it is named in the data.
3. **Long name** – Provide the expanded name of the output variable.
4. **Unit** – Report the unit used to report the output variable.  
5. **Add algorithm variable** – This button adds the output variable to the ATBD.

#### *2.3.6 Algorithm Usage (Step 6)*

This step describes the intended use of the algorithm’s output data and the validation process to assess the quality of the algorithm(s). ATBD authors should discuss any constraints or limitations for using the output data (Figure 33). Also, provide the validation methods used to determine uncertainties and errors associated with the algorithm’s output data and report the results, including any errors and uncertainties associated with the output data (Figure 34). If known, state the source of the uncertainties. This content shows end users the reliability of the algorithm and its output data. Also, refer to Figure 23 for descriptions of the rich content editor.

![Figure 33](https://github.com/bwbaker1/APT_Images/blob/master/figure33_annotation.png?raw=true "Figure 33 Limitations and constraints for using the output data derived by the algorithm. Outlined and labelled features correspond to numbered descriptions in text.")

1. **Describe the algorithm constraints** – Provide the constraints and limitations for using the algorithm output data.

![Figure 34](https://github.com/bwbaker1/APT_Images/blob/master/figure34_annotation.png?raw=true "Figure 34 Performance assessment of the algorithm. Outlined and labelled features correspond to numbered descriptions in text below.")

1. **Validation methods** – Describe the scientific methods utilized to validate the algorithm. The details provided should match the current algorithm’s maturity. 
2. **Uncertainties** – Specify any errors applicable to the validation method. This may include uncertainty in scientific and mathematical methods and/or errors associated with observation retrievals.
3. **Errors** – Report the results of the algorithm validation, including statistical relationships between the algorithm output and the implemented validation.

#### *2.3.7 Algorithm Implementation (Step 7)*

This step discusses the process of implementing the algorithm(s) and accessing relevant data. The algorithm implementation section directs end users to the algorithm’s source code and relevant information to execute the source code (Figure 35). Similarly, provide access URLs to the algorithm’s input and output data (Figure 36 and 37) and any alternative data access mechanisms (Figure 38). This content promotes transparency and makes it possible for end users to reproduce the product. Note: refer to Figure 23 for descriptions of the rich content editor.

![Figure 35](https://github.com/bwbaker1/APT_Images/blob/master/figure35_annotation.png?raw=true "Figure 35 Algorithm implementation is described and added to the ATBD. Outlined and numbered features correspond to numbered descriptions in text below.")

1. **URL** – Provide an URL that directs users to the algorithm implementation source code.
2. **Description** – Describe relevant information needed to execute the algorithm implementation source code. This may include, but not be limited to, execution instructions, memory requirements, programming languages, and dependencies.
3. **Add** – This button creates new fields to add information regarding algorithm implementation.

![Figure 36](https://github.com/bwbaker1/APT_Images/blob/master/figure36_annotation.png?raw=true "Figure 36 Data input access is added to the ATBD. Outlined and numbered features correspond to numbered descriptions in text below.")

1. **URL** – Provide an algorithm data input access URL into this field. This should link to data input and used in the algorithm.
2. **Description** – Enter a description of the method to access the data.
3. **Add** – This button allows for additional access URLs to the algorithm data inputs to be included in the ATBD. Provide access to all the data inputs used in the algorithm(s).

![Figure 37](https://github.com/bwbaker1/APT_Images/blob/master/figure37_annotation.png?raw=true "Figure 37 Data output access is added to the ATBD. Outlined and numbered features correspond to numbered descriptions in text below.")

1. **URL** – Add an algorithm output data access URL into this field. This should link to the output data from the algorithm.
2. **Description** – Enter a brief description of the data access method. This should provide context for users on how to access the data.
3. **Add** – This button allows for additional data access output URLs to be included in the ATBD.  Be sure to include all output data from the algorithm(s).

![Figure 38](https://github.com/bwbaker1/APT_Images/blob/master/figure38_annotation.png?raw=true "Figure 38 New data access related URLs added to the ATBD. Outlined and numbered features correspond to numbered descriptions in text below.")

1. **URL** – Enter alternative data access mechanisms, such as links to machine services, ordering services, and DAAC websites into this field.
2. **Description** – Enter a brief description of the provided alternative data access URL.
3. **Add** – This button allows any additional related URLs to be entered into the ATBD.

#### *2.3.8 Closeout (Step 8)*

This step describes the closeout section of the ATBD (Figure 39 and 40). A summary (i.e., abstract) is required for all ATBDs. Discussion and acknowledgments is only required for authors that intend to publish their ATBD with the American Geophysical Union (AGU) Wiley’s Earth and Space Science journal. In this section, authors will signify if they plan to submit the ATBD for a journal publication. The discussion section provides the value and implications of the algorithm along with any conclusions. Potential use cases can also be described in this section. All funding sources related to this work should be listed in the acknowledgements section. This section can also be used to thank any colleagues and other contributors.  The AGU’s journal style guide documents can be found here: [Grammar and Style Guide](https://www.agu.org/Publish-with-AGU/Publish/Author-Resources/Grammar-Style-Guide#referenceformat) and [Text Requirements](https://www.agu.org/Publish-with-AGU/Publish/Author-Resources/Text-requirements). Note: refer to Figure 23 for descriptions of the rich content editor.

![Figure 39](https://github.com/bwbaker1/APT_Images/blob/master/figure39_annotation.png?raw=true "Figure 39 ATBD abstract and journal details. Outlined and labelled features correspond to numbered descriptions in text below.")

1. **Short ATBD summary** – Brief summary that describes the ATBD in less than 250 words. 
2. **Journal details** – Convey the publication plans for the ATBD. Options include not to be submitted to AGU journal through the APT, will be submitted to AGU’s Earth System Science journal through the APT, already submitted to a journal, and already published. Note: authors that select to publish the ATBD through the APT will be required to include a discussion and acknowledgements (Figure 40). 

![Figure 40](https://github.com/bwbaker1/APT_Images/blob/master/figure40_annotation.png?raw=true "Figure 40 Discussion, Data availability, and acknowledgments. Outlined and labelled features correspond to numbered descriptions in text below.")

1. **Journal details** – Convey whether or not you plan to submit this ATBD to the AGU’s Earth System Science journal. If yes, then discussion, data availability statements, and acknowledgments are required.
2. **Significance discussion** – Provide a data availability statement for each dataset that supports your research. 
3. **Data availability statements** – This button removes a row from the table.
4. **Acknowledgments list** – Provide a list of all funding sources related to this work for all authors into this field. This field can also be used to mention colleagues that helped support this work and other contributors. The format should be first name and last name or first name initial and last name.

### 2.4 Rich Text Editor, Inserting Tables, and Uploading Figures

A LaTeX backend enables entry of rich content (e.g., tables, figures, references, and equations) that is necessary for scientific writing. Figures 41-43 show examples of using the rich content editor to format content, insert tables, and upload images into an ATBD. Inserting tables and figures is a relatively straightforward process; however, inserting equations using the equation editor requires knowledge of LaTeX mathematical commands. For guidance on inserting equations in the APT, see the “LaTeX Help Manual for the Algorithm Publication Tool (APT).” The use of a LaTeX backend allows authors to focus on writing scientific content and not formatting the document. 

![Figure 41](https://github.com/bwbaker1/APT_Images/blob/master/figure41.png?raw=true "Figure 41 The APT”s Rich Content Editor. Outlined and labelled features correspond to numbered descriptions in text below.")

1. **Bulleted List** – This button inserts a bulleted list into the text box.
2. **Numbered List** – This button inserts a numbered list into the text box.
3. **Insert Equation** – This button inserts an equation into the text box. The APT uses LaTeX to create equations. Inserting equations requires that authors have knowledge of LaTeX’s mathematical commands.  
4. **Heading** – Create a new heading.
5. **Insert Reference** – This button provides an option to insert an existing reference(s) or to create a new one. 
6. **Insert Table** – This button inserts a table into the ATBD (Figure 42)
7. **Insert Image** – This feature allows an author to upload an image and caption (Figure 43). Note that uploads must be in an image format. 
8. **Undo** – Clicking this icon will undo the previous action.
9. **Redo** – Clicking this icon will redo the previous action.
10. **Keyboard shortcuts** – Prompt that displays various keyboard shortcuts related to general actions, contextual actions, inserting items, and formatting.

![Figure 42](https://github.com/bwbaker1/APT_Images/blob/master/figure42_annotation.png?raw=true "Figure 42 Insert tables using the rich content editor. Outlined and labelled features correspond to numbered descriptions in text below.")

1. **Insert table** – This button inserts a table into the ATBD.
2. **Add row** – This button adds a row to the table.
3. **Remove row** – This button removes a row from the table.
4. **Add column** – This button adds a column to the table.
5. **Remove column** – This button removes a column from the table.
6. **Delete** – Clicking this icon deletes the table.
7. **Table cells** – Add table content into the table.
8. **Table caption** – Enter the desired caption into the table.

![Figure 43](https://github.com/bwbaker1/APT_Images/blob/master/figure43_annotation.png?raw=true "Figure 43 Upload images using the rich content editor. Outlined and labelled features correspond to numbered descriptions in text below. ")

1. **Upload an Image** – Use this button to select the desired image(s) to upload. Note that the image must be in an image format.
2. **Image Caption** – Enter the desired figure caption in this box.

### 2.5 Searching for ATBDs Using the APT’s Centralized Repository

The APT provides ATBDs in a centralized location in an effort to simplify discoverability of these documents. From the APT’s main landing page, navigating to the Documents tab (see Figure 2) shows a list of all published ATBDs, which can be accessed and downloaded. Users can also utilize the APT's search interface to search, access and download ATBDs (Figure 44). Any user can search and view published ATBDs. This section provides an overview of the centralized ATBD repository.

![Figure 44](https://github.com/bwbaker1/APT_Images/blob/master/figure44_annotation.png?raw=true "Figure 44 The APT’s elastic search feature allows users to search and locate archived ATBDs from the centralized repository. Outlined and labelled features correspond to numbered descriptions in text below. ")

1. **Term** – Enter a search term into the search bar.
2. **Year** – Dropdown list that allows for filtering the search by year.
3. **Search** – This button performs the search.