---
title: APT
---

# Algorithm Publication Tool (APT) User Guide

## 1. Introduction

The Algorithm Publication Tool (APT) is a cloud-based publication tool developed within NASA’s Earth Science Data Systems (ESDS) program that standardizes Algorithm Theoretical Basis Document (ATBD) content, streamlines the authoring process of ATBDs, and allows the science community to search and retrieve ATBDs from a centralized repository. This document provides a detailed overview of APT and how it functions and serves as a guide for authors using APT to write, publish, and locate ATBDs.

[[Back to top](#)]

### 1.1 ATBDs in NASA

ATBDs provide data users with the physical theory, mathematical procedures, and applied assumptions used to develop algorithms that convert radiances measured by remote sensing instruments into geophysical quantities. NASA requires ATBDs for all Earth Observing System (EOS) instrument data products. The goal of APT is to provide a comprehensive authoring, review, and publication service for NASA, which includes a centralized repository for published documents. APT utilizes a standardized content template to remove confusion and uncertainty around ATBD content requirements. This standardization further ensures that each NASA data product corresponds to a single ATBD. Furthermore, modernization of ATBDs through use of APT, in which the content is reconceptualized as metadata, supports easy and rapid content updates, centralizes ATBDs in a single location to improve end user search and discovery, and promotes both human and machine content parsing that streamlines data understanding.

[[Back to top](#)]

### 1.2 Components of the Algorithm Publication Tool

The main goal of APT is to modernize NASA Earth science documentation by developing a web-based interface for writing, reviewing, publishing, locating, and accessing ATBDs. This is partially accomplished by moving from a static to dynamic model of documentation with intelligent connections to software, data, and other supporting resources in order to improve transparency and promote scientific reproducibility. APT provides a single-entry point for writing and updating ATBDs and a centralized document repository to enable users to access and view ATBDs (Figure 1).

Users have a second option to create an ATBD using one of the provided ATBD templates (e.g., Google Docs, Microsoft Word, or LaTeX). The templates are structured identical to ATBDs generated from APT. Note users (1) must follow the structure of the template (i.e., you cannot change or delete headings), (2) are responsible for ensuring the document is properly formatted and (3) must have the ATBD reviewed before submitting to APT. Once the ATBD is completed and reviewed, users can submit the document using APT’s upload feature. See the template user’s guide for more details on using APT’s ATBD templates. This template option gives users more flexibility to use software or a word processor of their choosing.

![Figure 1](https://github.com/bwbaker1/APT_UserGuide_Figures/blob/main/APT_Figure1.png?raw=true "Figure 1. The APT workflow and components. Users have a choice of workflows: the authoring tool or a template in an editing environment of choice. The APT authoring environment consists of an ATBD metadata model, a database, and front-end tool with a dashboard. Both workflows result in a centralized PDF document repository for all users to find and access published ATBDs.")

APT’s components include a metadata model, a front-end publishing tool with supporting content database and document management dashboard, and a document repository for public ATBD access. First, within the tool, ATBDs are structured as metadata, not just documents. This means that component metadata is reusable across different ATBDs, promoting consistency and standardization while reducing human input. For example, within APT, authors are encouraged to use existing data, such as citation information, instead of manually inputting this information into an ATBD. This reduces the potential for errors. In addition, data products and source code are often dynamic, yet it can be time-consuming or difficult to update static documents. Another benefit of the metadata model developed for APT is that it makes the content dynamic and therefore easier to update. Finally, the metadata model provides users with ATBDs in machine readable formats, which increases the discoverability of these documents.

The second component of APT is the database and front-end tool. ATBD authors use the APT’s cloud-based authoring tool to write new documents and to edit existing documents. The front-end authoring tool guides users through the ATBD authoring process in a series of organized steps. This helps authors provide the necessary content, reduces the need to organize and structure documents, and promotes standardization across ATBDs. Content entered into this tool is saved into a database, the structure defined by the ATBD metadata model. This database infrastructure supports reusing content across documents. Once created, the front-end feature provides two options for previewing documents: HTML or a PDF document that is easy to download and print.

Data users have often found searching for and discovering existing ATBDs very challenging. Thus, the final component of APT is a centralized repository and discovery portal for public access. Searching for ATBDs through the repository utilizes both identifying metadata (e.g., reference information and science keywords) and document content (e.g., equations and scientific concepts). The repository and search capabilities increase the discoverability of ATBDs. A future goal is to integrate existing NASA ATBDs into the centralized repository for easy access. With this integration, the search and discovery will be improved for not only new ATBDs but previous historical ATBDs as well.

[[Back to top](#)]

## 2. Details of the Algorithm Publication Tool Pages and Features

APT has various features that improve the process of authoring, searching, and discovering documents and content through the centralized ATBD repository.

[[Back to top](#)]

### 2.1 Main Landing Page and User Login

The main landing page is open to all users (Figure 2). The top blue navigation bar provides access to important information and services. Authorized users can sign in by clicking “Sign in” (see item 7 in Figure 2). New authors should click “Sign in'' to find a link to initiate sign up for a new account. Users can ask questions or provide feedback to the APT management team at any time by clicking on the Feedback button (item 6, Figure 2). There are two user guides accessible from the “User Guide” button (item 5, Figure 2). Any user can see the publicly available, completed ATBDs by pressing the “ATBDs” button (item 3, Figure 2).

![Figure 2](https://github.com/bwbaker1/APT_UserGuide_Figures/blob/main/APT_Figure2.png?raw=true "Figure 2. Overview of the APT landing page. Red outlined and labeled items correspond to the numbered descriptions in text below.")

1. **NASA APT** - Persistent button which redirects users to the APT home page
2. **Welcome** – This button redirects users to the APT landing page
3. **ATBDs** – This button redirects users to the ATBD Dashboard that lists all completed and publicly available ATBDs
4. **About** – This button redirects users to the About page that describes APT and includes answers to frequently asked questions (FAQs).
5. **User Guide** – This button redirects users to the APT User Guide and the LaTeX help manual.
6. **Feedback** – This button provides a form for users to submit feedback about APT or to ask a question (Figure 3).
7. **Sign in** – This button redirects users to the APT sign in page.
8. **Learn more** – This button redirects users to the APT’s About page.
9. **Explore the existing documents** – This button redirects users to the ATBD Dashboard, just like the ATBD button (item 3 in Figure 2).

![Figure 3](https://github.com/bwbaker1/APT_UserGuide_Figures/blob/main/APT_Figure3.png?raw=true "Figure 3. APT utilizes the Earth Science Data and Information System (ESDIS) feedback module to allow users to provide the APT project team with feedback. The red outlined and labeled items correspond to the numbered descriptions in text below.")

1. **Subject** – Briefly describe the subject of this feedback submission.
2. **Details** – Use this text box to provide specific details regarding your feedback.
3. **Name** – Provide your first and last name.
4. **Email** – Enter your email address so the APT team can respond to you if needed.
5. **Attachment** – Use this button to attach a file, if needed (note: only .jpg, .jpeg, .bmp, .gif, .png, .pdf, .txt, .rtf, .doc, .docx, and .csv file types are allowed). You can use this to provide an annotated example of the change you desire or the issue you observed.
6. **I’m not a robot (reCAPTCHA)** – Checking the box “I’m not a robot” distinguishes between humans and bots and helps protect APT from spam and abuse.
7. **Submit** – Click this button once all fields are completed to submit your feedback to the APT team.

Any users can view completed ATBDs via the APT dashboard. However, only authorized and authenticated users can create or edit an ATBD. Users must first create an account with APT to request authorization. APT uses Amazon Web Services Cognito for authorization and authentication. Once an account is requested, a notification is sent to the APT curator, who then authorizes the user via Cognito. After approval, the user must sign in to create new ATBDs or view and edit ATBDs they are contributing to (see Quick Start for details).

![Figure 4](https://github.com/bwbaker1/APT_UserGuide_Figures/blob/main/APT_Figure4.png?raw=true "Figure 4. The APT sign in page. The items outlined in red correspond to the numbered descriptions in text below." )

1. **Email** – Enter the email associated with the account.
2. **Password** – Enter your account password.
3. **Forgot your password** – This button redirects you to a prompt for resetting a forgotten password.
4. **Sign in** – Click this button to log into APT.
5. **Sign up** – This link prompts you to create a new account if needed (see Quick Start for instructions on how to sign up).

[[Back to top](#)]

### 2.2 Approved User Dashboard

A user will be redirected to your user dashboard when you successfully log into APT (Figure 5). This dashboard is where you can create a new ATBD draft, edit an existing ATBD draft, and view all publicly available ATBDs that are assigned to your account. Any approved user can have various possible APT roles for an ATBD: including lead author (the user that created the ATBD), contributing author (a user assigned as a contributor to the document by the lead author), or reviewer (a user asked to review a completed document draft). Navigate through the following tabs to sort the ATBDs on your dashboard by those you are leading, contributing to, or reviewing. The public user dashboard only shows completed, publicly available ATBDs. Any list can be searched in a variety of ways. A user can navigate through the following documents tabs within the user dashboard including leading, contributions, reviews, and public. This section describes the tabs, pages, and features of the user dashboard.

![Figure 5](https://github.com/bwbaker1/APT_UserGuide_Figures/blob/main/APT_Figure5.png?raw=true "Figure 5. Upon successful login, an approved user sees this welcome message. The red outlined and labeled items correspond to the numbered descriptions in text below."  )

1. **Dashboard** – This button redirects you to your individual dashboard containing all documents associated with your account, if they are an approved user (Figures 6-9). If you are not an approved user, you will see only the public ATBDs on the dashboard.
2. **Contacts** – This button redirects you to the Contacts page which lists all contacts stored within APT and allows you to create a new contact (see Section 2.2.1).
3. **About** – This button redirects you to the About page, which introduces APT.
4. **User Guide** - This button redirects you to this document, the APT user guides (see Section 2.2.2). 
5. **Feedback** – This button brings up a form for you to submit feedback about APT to the project team (see Figure 3).
6. **Username and profile** – The username of the current account appears in the upper right once you successfully log in to APT. The dropdown menu provides two options; view your profile or sign out of your APT account. If signing out, you are automatically redirected to the public APT dashboard.

![Figure 6](https://github.com/bwbaker1/APT_UserGuide_Figures/blob/main/APT_Figure6.png?raw=true "Figure 6. Approved user dashboard with the lead author tab selected. The red outlined and labeled items correspond to the numbered descriptions in text below."  ) 

1. **Create** – This button, located in the upper right of the dashboard, is used to create a new ATBD. You become the lead author by default when you create an ATBD.
2. **Documents tabs** – These tabs allow a user to quickly navigate and see all documents associated with your account. Clicking the “leading” tab shows all ATBDs for which you are the lead author. The “contributions” tab shows you all of the documents that you are allowed to contribute to. The “reviews” tab indicates the ATBDs you are assigned to review. The public tab shows all completed and public ATBDs that anyone can see. Once a document is finalized and published, it will be located in the public tab instead of the other tabs.
3. **Status filter** – This dropdown menu allows users to filter your dashboard ATBDs by current document status. By default, all documents of any status are shown. The status indicates whether an ATBD is a draft, is in review, is being prepared and finalized for public release, or is publicly available (either publicly available in APT or published by the ESS journal).
4. **Order** – This dropdown feature allows you to sort your dashboard ATBDs by most recent, alphabetical by title, or by action.
5. **Documents** – This area lists all documents pertaining to the current tab (i.e. filtered by leading, contributing, reviewing, and public). The information shown for each document includes: document title, version, status, date and time of last update, lead author username with number of collaborators, and overall number of comments compared to the number of comments resolved. In this example, the leading tab is selected, so only the ATBDs for which the user is lead author are shown.
6. **Request publication** – This button sends a publication request to the APT curator. Upon checking the document and all comments for completion, the curator will either accept or reject the publication request. Note that an ATBD must first go through the review process and the review must be closed by the curator before the option to request publication will appear within the lead author’s dashboard.
7. **Request review** – This button sends a review request to the APT curator. Upon review, the curator will either accept or reject the review request. If accepted, the ATBD will begin the review process. The lead author must indicate suggested reviewers for assignment. The curator sends the reviewers a request to review the document.
8. **Option dropdown** – This button brings up the feature options.
9. **Options** – These are actions that can be performed on an ATBD as the lead author. These include: view information about the document, edit, change lead author, draft a new major version, (such as when you need to make a new document but want to reuse the content of the current document), update document slightly to a new minor version, and delete the ATBD. Note that the options to draft a new major or minor version are grayed out and will only be available once an ATBD has been made public.

![Figure 7](https://github.com/bwbaker1/APT_UserGuide_Figures/blob/main/APT_FIgure7.png?raw=true "Figure 7. User dashboard with contributing tab selected. The red outlined and labeled items correspond to the numbered descriptions in text below. See Figure 6 for a detailed description of all the items.")

1. **Documents** – This area documents within the current documents tab (i.e., leading, contributing, reviewing, and public). In this example, the contributing tab is selected. These are ATBDs the user has been asked to contribute to.
2. **Options** – Actions that can be performed on an ATBD as a contributing author on an ATBD, which includes view information, edit, and update minor version.

![Figure 8](https://github.com/bwbaker1/APT_UserGuide_Figures/blob/main/APT_Figure8.png?raw=true "Figure 8. User dashboard reviews tab. See Figure 6 for a detailed description of all features.")

1. **Documents** – This region displays all documents within the current documents tab (i.e., leading, contributing, reviewing, and public). In this example, the review tab is selected. The document shown is the document the user has been asked to review. The user can click on the document to begin editing.

![Figure 9](https://github.com/bwbaker1/APT_UserGuide_Figures/blob/main/APT_Figure9.png?raw=true "Figure 9. User dashboard public tab. See Figure 5 for a detailed description of all features.")

1. **Documents** – This displays all documents within the current documents tab (i.e., leading, contributing, reviewing, and public). In this example, the public tab is selected, which displays ATBDs the user worked on that are now available to the public.

[[Back to top](#)]

#### 2.2.1 Contacts Page

The contacts page lists all of the names stored within the APT database. All authors have access to this stored contact information so that contacts can easily be added to any document. This saves an author time and promotes contact information consistency among ATBDs. If a contact does not exist in the list yet, a user can create one from this page by selecting the “create document” button in the upper right (Figure 10 and 11). A user can also edit an existing contact. This section describes adding contacts from the contacts page accessed via the top navigation bar. In contrast, Section 2.3.2 describes adding existing contacts from within an ATBD.

![Figure 10](https://github.com/bwbaker1/APT_UserGuide_Figures/blob/main/APT_FIgure10.png?raw=true "Figure 10. The APT Contacts page. The red outlined and labeled items correspond to the numbered descriptions in text below.")

1. **Create** – This button redirects a user to create a new contact.
2. **Open Dropdown** – Click the stacked dots symbol to open the Options dropdown feature.
3. **Options** – A user can select from this list to either edit or delete the selected contact. Do not delete a contact unless you are absolutely certain that it should be deleted, as this action may affect another ATBD.

![Figure 11](https://github.com/bwbaker1/APT_UserGuide_Figures/blob/main/APT_Figure11.png?raw=true "Figure 11. Form to create a new contact. The red outlined and labeled items correspond to the numbered descriptions in text below.")

1. **Save** – This button saves content entered into the new contact. Note that a prompt will appear if there is unsaved content.
2. **First name** – Enter the first name of the contact (required).
3. **Middle name** – Enter the middle name of the contact (optional).
4. **Last name** – Enter the last name of the contact (required).
5. **UUID** – Enter the universally unique identifier (uuid) for the new contact.
6. **URL** – Enter the URL that is relevant to the contact added. This can be a webpage or a LinkedIn entry.
7. **Contact mechanism type** – Select the contact mechanism type from the dropdown list (required). This is typically an email address or phone number.
8. **Contact mechanism value** – Enter the contact value associated with the contact mechanism (required).
9. **Add a new contact mechanism** – Click this button to create another contact mechanism type and value. For instance, you can add both email and phone number as contact information by clicking this button and selecting the type of contact mechanism, etc.

[[Back to top](#)]

#### 2.2.2 User Guide

User documentation is found on the APT’s User Help Guide page. The user guide provides guidance for using APT and embedded LaTeX capabilities (Figure 12).

![Figure 12](https://github.com/bwbaker1/APT_UserGuide_Figures/blob/main/APT_Figure12.png?raw=true "Figure 12. User Guide for APT providing needed documentation for all parts of the interface. The red outlined and labeled item corresponds to the numbered description below.")

1. **Guide selection** – This dropdown contains a list of available guides users can choose from, either the APT interface user guide or the LaTeX help manual.

[[Back to top](#)]

## 2.3 Creating, Editing, and Writing ATBDs Using APT

Users can create a new ATBD or edit an existing one (Figure 13) from the user dashboard. This section describes the process of creating, editing, and writing an ATBD using APT.

![Figure 13](https://github.com/bwbaker1/APT_UserGuide_Figures/blob/main/APT_Figure13.png?raw=true "Figure 13. Creating or editing an ATBD. Users can create new ATBDs or edit existing ATBDs that they are associated with as shown on the dashboard. The red outlined and labeled items correspond to the numbered descriptions in text below.")

1. **Create** – The button creates a new ATBD. Users will be prompted with an information box when they create a new ATBD (Figure 14).
2. **Open Dropdown** – To edit an existing ATBD listed on the dashboard, the user clicks the stacked dots symbol to open the Options dropdown feature and then selects Edit from the list provided. This will open the ATBD in edit mode (Figure 15).

![Figure 14a](https://github.com/bwbaker1/APT_UserGuide_Figures/blob/main/APT_Figure14a.png?raw=true "Figure 14a. Prompt that appears when a user creates a new ATBD. Users must indicate they understand the content shown on the page in order to continue.")

1. **Understood** – After clicking “Create” (item 1 in Figure 13) the pop-up outlines the different stages of ATBD activity when working on a document using APT. A user must click the “Understood” button to indicate that the content has been read before moving to the next step.

![Figure 14b](https://github.com/bwbaker1/APT_UserGuide_Figures/blob/main/APT_Figure14b.png?raw=true "Figure 14b. Prompt that appears when a user creates a new ATBD. Users must indicate whether they want to create a document within the APT interface or to upload an existing ATBD PDF.")

1. **Title** – Authors should enter a descriptive, formal title of the ATBD. It is recommended that the title be as descriptive as possible, while keeping acronyms to a minimum.
2. **Alias** – Authors should enter an alias title for the ATBD. Once an ATBD is completed, the alias will not be editable. All aliases should be unique.
3. **Create new ATBD in APT** – Select to create an ATBD within the APT interface.
4. **Upload existing ATBD PDF** – Select to upload an existing ATBD PDF that was created using one of the provided ATBD templates.

![Figure 15](https://github.com/bwbaker1/APT_UserGuide_Figures/blob/main/APT_Figure15.png?raw=true "Figure 15. ATBD viewing and editing modes. The red outlined and labeled item corresponds to the numbered description below.")

1. **Mode** – When a user clicks on the dropdown indicator next to the version numbers a list containing two mode choices is shown and the user can choose between viewing the ATBD or editing the ATBD. By default, the ATBD is presented in viewing mode. Note that edits to the document can only be made in editing mode.

Once in editing mode, a user can navigate quickly between the APT authoring steps using the dropdown feature shown at location 1 of Figure 16.

![Figure 16](https://github.com/bwbaker1/APT_UserGuide_Figures/blob/main/APT_Figure16.png?raw=true "Figure 16. The APT navigation feature associated with creating an ATBD. The red outlined and labeled item correspond to the numbered description below.")

1. **Select step drop down menu** – The dropdown list feature allows ATBD authors to quickly navigate between the APT’s eight pages.

The remainder of this section provides details about writing ATBDs using APT. The user interface divides the ATBD authoring process into eight steps as shown in Figure 16. By logically grouping the content required to write an ATBD, the process is easier to work on and transition between. The following descriptions identify the content that authors will need to provide in each of these steps. See Section 2.2.9 for help using the APT rich content editor to format content and insert equations, tables, and images.

Each step of the algorithm publication tool includes a global save button that must be clicked in order for content to be saved (Figure 17). Note that newly added content is not automatically saved when a user navigates away from the current step. Users are prompted when there is unsaved content.

![Figure 17](https://github.com/bwbaker1/APT_UserGuide_Figures/blob/main/APT_Figure17.png?raw=true "Figure 17. The global save button.")

[[Back to top](#)]

#### 2.3.1 Identifying Information (Step 1)

The first authoring step prompts a user to input unique information that identifies the new ATBD (Figure 18a). The content provided in this step will be used to generate structured citations for the ATBD (Figure 19), and will ultimately provide end users with a means to identify the document.

![Figure 18a](https://github.com/bwbaker1/APT_UserGuide_Figures/blob/main/APT_Figure18a.png?raw=true "Figure 18a. ATBD unique identifying information. The red outlined and labeled items correspond to the numbered descriptions in text below.")

1. **Comments** – Clicking this button opens the comments section of the ATBD (Figure 18b). A user can add or respond to a comment by clicking this icon anywhere it is found in APT.
2. **Information** – Clicking this icon reveals more information that can be helpful with understanding the needed content for the text field. This is a persistent feature within APT that operates in the same way anywhere a user finds it located.
3. **Title** – Authors should enter a descriptive, formal title of the ATBD. It is recommended that the title be as descriptive as possible, while keeping acronyms to a minimum.
4. **Alias** – Authors should enter an alias title for the ATBD. Once an ATBD is completed, the alias will not be editable. All alias must be unique.
5. **DOI** – Enter the digital object identifier (DOI) associated with this ATBD. The DOI is assigned by the APT curator.
6. **Section progress** – Toggle feature that allows authors to mark the section as complete or incomplete. This is a persistent feature through each step.
7. **Version description** – Author should provide a meaningful description of how this APT ATBD version differs from previous versions. This is only important for new major versions of the ATBD.

![Figure 18b](https://github.com/bwbaker1/APT_UserGuide_Figures/blob/main/APT_Figure18b.png?raw=true "Figure 18b. Comment section. The red outlined and labeled items correspond to the numbered descriptions in text below.")

1. **Comment filter** – User can filter document comments by all, resolved, unresolved and by the document section (e.g., Contacts).
2. **Comment** – Provide a comment related to the ATBD.
3. **Post** – This button posts the comment.

![Figure 19](https://github.com/bwbaker1/APT_UserGuide_Figures/blob/main/APT_Figure19.png?raw=true "Figure 19. ATBD citation information. The red outlined and labeled items correspond to the numbered descriptions in text below.")

1. **Authors** – Enter the name of the individual(s) or organization responsible for authoring the ATBD (required field).
2. **Editors** – Provide the name of the individual(s) or organization responsible for editing and publishing the ATBD (optional field).
3. **Publisher** – Provide the name of the individual(s) or organization that published the ATBD (optional field).
4. **Release Date** – Provide the release date of the ATBD (required field). The data input in this field should be numbers.
5. **Version** – Enter the ATBD version number (optional field).
6. **Online Resource** – Include a URL that directs ATBD users to the landing page of the ATBD (optional field).

[[Back to top](#)]

#### 2.3.2 Contact and Reviewer Information (Step 2)

The second step requests contact information for the individual or group responsible for fielding user questions regarding the ATBD (Figure 20). APT stores information from all published documents, which authors can retrieve and use in other documents. Therefore, authors have the option to search for existing contact information stored in APT and should use this information whenever possible instead of entering information manually. This ensures that information is consistent across all documents, which is an advantage of APT.

Document reviewers should be added as a contact. However, their information will not be included on the document PDF. Select “Document Reviewer” under roles related to the document. A minimum of two reviewers are required. 

![Figure 20](https://github.com/bwbaker1/APT_UserGuide_Figures/blob/main/APT_Figure20.png?raw=true "Figure 20. Individual or group contact information. The red outlined and labeled items correspond to the numbered descriptions in text below.")

1. **Add a contact** – This feature allows authors to add ATBD contact information. Once selected, users have the option to search for an existing contact or create a new contact (Figure 28).

![Figure 21](https://github.com/bwbaker1/APT_UserGuide_Figures/blob/main/APT_Figure21.png?raw=true "Figure 21. Select or create a new contact. The red outlined and labeled items correspond to the numbered descriptions in text below.")

1. **Delete** – Clicking the delete icon deletes the contact from the ATBD.
2. **Select contact** – This opens a dropdown list feature that allows authors to either search for an existing contact or create a new one (Figure 22). As noted above, authors should use existing contact information whenever possible to promote consistency.
3. **Add new contact** – This button allows authors to insert an additional contact.

![Figure 22](https://github.com/bwbaker1/APT_UserGuide_Figures/blob/main/APT_FIgure22.png?raw=true "Figure 22. Required and optional fields for creating a new ATBD contact. The red outlined and labeled items correspond to the numbered descriptions in text below.")

1. **Create new contact** – Dropdown menu that allows authors to select an existing contact or to create a new one.
2. **First Name** – Provide the first name of the contact person (required field).
3. **Middle Name** – Provide the middle name of the contact person.
4. **Last Name** – The last name of the contact person should be entered into this field (required field).
5. **UUID** – Enter the contact person’s Universally Unique Identifier (UUID). UUIDs are identification numbers that uniquely identify a person or group. The data input in this field should be a string.
6. **URL** – Provide a URL that is relevant for contacting the contact person.
7. **Add a contact mechanism type** – Dropdown menu that allows authors to select the contact mechanism type (required field).
8. **Add contact mechanism value** – Enter the contact value associated with the contact mechanism such as number, email, or URL (required field). The value should match the chosen contact mechanism type.
9. **Add a new contact mechanism** – The button creates an additional contact mechanism type and value.
10. **Contact roles** – Select the contact’s role in the ATBD.
11. **Add new** – This button adds another contact to the ATBD.

[[Back to top](#)]

#### 2.3.3 References (Step 3)

There are two options for adding references to the ATBD (Figure 23), (1) import a BibTeX file or (2) enter the information manually.

![Figure 23](https://github.com/bwbaker1/APT_UserGuide_Figures/blob/main/APT_Figure23.png?raw=true "Figure 23. Two options to add references to the ATBD. The red outlined and labeled items correspond to the numbered descriptions in text below.")

1. **Add a reference** – This button allows authors to manually enter citation information for one or more references (Figure 24).
2. **Upload BibTeX file** – This button uploads one or more references using BibTeX files. A BibTeX file will not upload if the file does not include the minimum required information or if the file contains an error. The required information varies by reference entry type.
3. **Actions** – Dropdown feature that allows users to select between manually adding a new reference, uploading a BibTeX file, or deleting a selected reference.

![Figure 24](https://github.com/bwbaker1/APT_UserGuide_Figures/blob/main/APT_FIgure24.png?raw=true "Figure 24. Form to manually enter reference information. The red outlined and labeled items correspond to the numbered descriptions in text below.")

1. **Reference filter** – An ATBD’s references can be filtered by “all,” “none,” or “unused.”
2. **Select Ref** – This is a check box that selects a specific reference.
3. **Title** – State the full title of the referenced document.
4. **Authors** – Provide the name of the author(s) (in order) or the group that authored the referenced material.
5. **Series** – Provide the name of the publication series of this reference.
6. **Edition** – Enter the edition of the series in which the reference is published.
7. **Volume** – Provide the volume number of the published series.
8. **Issue** – Enter the issue number of the series.
   Report Number –Enter the report number related to reference.
9. **Report number** - If appropriate, provide the report number of the referenced material.
10. **Publication place** – Name the publication location (city if possible) of the reference.
11. **Year** – Provide the publication year of the reference. The data input in this field should be numbers.
12. **Publisher** – Enter the name of the entity that published the reference.
13. **Pages** – Enter the page numbers associated with the reference. The data input in this field should be numbers.
14. **ISBN** – Provide the reference’s International Standard Book Number (ISBN). An ISBN is a 10-digit (if assigned before 2007) or 13-digit number that uniquely identifies a book title and edition. For example, ISBN: 1896522874 identifies the book Women Astronauts.
15. **DOI** – Enter the reference’s Digital Object Identifier (DOI). A DOI is a unique set of characters and numbers that identify a specific article, report, book, etc. For example, the DOI 10.5067/TERRA/MODIS/L3M/PAR/2018 uniquely identifies the MODIS-TERRA Level 3 Mapped Photosynthetically Available Radiation Data Version R2018.0 dataset. Note that not all references have DOIs.
16. **Online Resource** – Provide any online resources that are related to the reference. For example, this could include links to relevant user guides, tools, documentation, landing pages, etc. that further support the reference.
17. **Other Reference Details** – Provide any additional useful citation information about the reference.
18. **Add a Reference** – Authors have an option to manually add another reference.
19. **Import BibTeX file** – Authors have an option to add another reference or a list of references by uploading a BibTeX file.

[[Back to top](#)]

#### 2.3.4 Introduction (Step 4)

This step provides a brief introduction and background to the ATBD (Figure 25 and 26). The introduction should provide users with a concise overview of the algorithm, including its derived quantities, scientific importance, and intended applications. Authors should explain the history and foundation regarding the development of the algorithm and a brief summary of the algorithm’s output data products. End users will use this content to understand the value and applicability of this data product.

These free-text fields utilize a rich content editor that automatically formats the introduction. APT utilizes LaTeX to build and insert tables, figures, references, and equations into these fields.

![Figure 25](https://github.com/bwbaker1/APT_UserGuide_Figures/blob/main/APT_Figure25.png?raw=true "Figure 25. Introduction to the ATBD. The red outlined and labeled items correspond to the numbered descriptions in text below.")

1. **Introduction** – Provide a description of the ATBD which concisely gives users the information needed to understand the relevance and usefulness of the ATBD.

![Figure 26](https://github.com/bwbaker1/APT_UserGuide_Figures/blob/main/APT_FIgure26.png?raw=true "Figure 26. Background to the ATBD. The red outlined and labeled items correspond to the numbered descriptions in text below.")

1. **Historical perspective** – Provide a brief summary regarding the history of the algorithm’s development and its output data.
2. **Additional information** – Provide any additional information that is relevant to the background of the ATBD.

[[Back to top](#)]

#### 2.3.5 Algorithm Description (Step 5)

This step first describes the scientific and mathematical theories and assumptions associated with the algorithm(s). The scientific theory and assumptions describe the scientific background that permits deriving parameters from the observations (Figure 27). Authors should also provide the underlying mathematical logic, including any assumptions, simplifications, and approximations behind the algorithms (Figure 28). The second aspect of this step identifies the algorithm’s input and output variables, including names and units used to report these variables (Figures 29-31). The content provided in this step gives end users the needed information to understand the theoretical background of the algorithm(s). Note: refer to Figure 41 for descriptions of the rich content editor.

![Figure 27](https://github.com/bwbaker1/APT_UserGuide_Figures/blob/main/APT_Figure27.png?raw=true "Figure 27. Insert the scientific theory and assumptions associated with the algorithm. The red outlined and labeled items correspond to the numbered descriptions in text below.")

1. **Describe the scientific theory** – Provide a description of the principles essential to the product’s retrieval. This should include a description of the physics and associated observed geophysical phenomenon.
2. **Scientific theory assumptions** – Describe any scientific or physical assumptions made in deriving the algorithm.

![Figure 28](https://github.com/bwbaker1/APT_UserGuide_Figures/blob/main/APT_Figure28.png?raw=true "Figure 28. Insert the mathematical theory and assumptions associated with the algorithm. The red outlined and labeled items correspond to the numbered descriptions in text below.")

1. **Describe the mathematical theory** – Describe the mathematical theory that is essential to the algorithm’s development. Mathematical theory is not required; however, the section is required. If there is no mathematical theory to add, please write “see scientific theory above.”
2. **Mathematical theory assumptions** – Provide a description of any mathematical assumptions, simplifications, and approximations made when deriving the algorithm. If there are retrieval error uncertainties, add a new header within the mathematical theory section.

![Figure 29](https://github.com/bwbaker1/APT_UserGuide_Figures/blob/main/APT_Figure29.png?raw=true "Figure 29. Add input and output variables used and generated by the algorithm. The red outlined and labeled items correspond to the numbered descriptions in text below.")

1. **Add a new input variable** – This button adds a new input variable used in the algorithm.
2. **Add a new output variable** – This button adds a new output variable used in the algorithm.

![Figure 30](https://github.com/bwbaker1/APT_UserGuide_Figures/blob/main/APT_Figure30.png?raw=true "Figure 30. Variable(s) that are used in the algorithm. The red outlined and labeled items correspond to the numbered descriptions in text below.")

1. **Algorithm input variables table caption** – Provide an appropriate input table caption.
2. **Name** – Provide the name of the variable that is input into the algorithm as it is named in the data.
3. **Long name** – Report the expanded name of the input variable.
4. **Unit** – Provide the unit used to report the input variable. For example, atmospheric pressure could be reported using hectopascals (hPa).
5. **Add new** – Clicking this button adds the provided input variable into the ATBD.

![Figure 31](https://github.com/bwbaker1/APT_UserGuide_Figures/blob/main/APT_Figure31.png?raw=true "Figure 31. Variable(s) that are generated by the algorithm. The red outlined and labeled items correspond to the numbered descriptions in text below.")

1. **Algorithm output variables table caption** – Provide an appropriate input table caption.
2. **Name** – Provide the name of the variable that is output from the algorithm as it is named in the data.
3. **Long name** – Provide the expanded name of the output variable.
4. **Unit** – Report the unit used to report the output variable.
5. **Add new** – This button adds the output variable to the ATBD.

[[Back to top](#)]

#### 2.3.6 Algorithm Usage (Step 6)

This step describes the intended use of the algorithm’s output data and the validation process to assess the quality of the algorithm(s). ATBD authors should discuss any constraints or limitations for using the output data (Figure 32). Also, provide the validation methods used to determine uncertainties and errors associated with the algorithm’s output data and report the results, including any errors and uncertainties associated with the output data (Figure 33). If known, state the source of the uncertainties. This content shows end users the reliability of the algorithm and its output data. Refer to Figure 41 for descriptions of the rich content editor.

![Figure 32](https://github.com/bwbaker1/APT_UserGuide_Figures/blob/main/APT_Figure32.png?raw=true "Figure 32. Limitations and constraints for using the output data derived by the algorithm. The red outlined and labeled items correspond to the numbered descriptions in text below.")

1. **Describe the algorithm limitations and constraints** – Provide the constraints and limitations for using the algorithm output data.

![Figure 33](https://github.com/bwbaker1/APT_UserGuide_Figures/blob/main/APT_Figure33.png?raw=true "Figure 33. Performance assessment of the algorithm. The red outlined and labeled items correspond to the numbered descriptions in text below.")

1. **Validation methods** – Describe the scientific methods utilized to validate the algorithm. The details provided should match the current algorithm’s maturity.
2. **Uncertainties** – Specify any errors applicable to the validation method. This may include uncertainty in scientific and mathematical methods and/or errors associated with observation retrievals.
3. **Estimated errors** – Report the results of the algorithm validation, including statistical relationships between the algorithm output and the implemented validation.

[[Back to top](#)]

#### 2.3.7 Algorithm Implementation (Step 7)

This step discusses the process of implementing the algorithm(s) and accessing relevant data. The algorithm implementation section directs end users to the algorithm’s source code and relevant information to execute the source code (Figure 34). Similarly, provide access URLs to the algorithm’s input and output data (Figure 35 and 36) and any alternative data access mechanisms (Figure 37). This content promotes transparency and makes it possible for end users to reproduce the product.

![Figure 34](https://github.com/bwbaker1/APT_UserGuide_Figures/blob/main/APT_Figure34.png?raw=true "Figure 34. Algorithm implementation is described and added to the ATBD. The red outlined and labeled items correspond to the numbered descriptions in text below.")

1. **URL** – Provide an URL that directs users to the algorithm implementation source code.
2. **Description** – Describe relevant information needed to execute the algorithm implementation source code. This may include, but not be limited to, execution instructions, memory requirements, programming languages, and dependencies.
3. **Add** – This button creates new fields to add information regarding algorithm implementation.

![Figure 35](https://github.com/bwbaker1/APT_UserGuide_Figures/blob/main/APT_Figure35.png?raw=true "Figure 35. Data input access is added to the ATBD. The red outlined and numbered items correspond to numbered descriptions in text below.")

1. **URL** – Provide an algorithm data input access URL into this field. This should link to data that is used in the algorithm.
2. **Description** – Enter a description of the method to access the data.
3. **Add** – This button allows for additional access URLs to the algorithm data inputs to be included in the ATBD. Provide access to all the data inputs used in the algorithm(s).

![Figure 36](https://github.com/bwbaker1/APT_UserGuide_Figures/blob/main/APT_Figure36.png?raw=true "Figure 36. Data output access is added to the ATBD. The red outlined and numbered items correspond to numbered descriptions in text below.")

1. **URL** – Add an algorithm output data access URL into this field. This should link to the output data from the algorithm.
2. **Description** – Enter a brief description of the data access method. This should provide context for users on how to access the data.
3. **Add** – This button allows for additional data access output URLs to be included in the ATBD. Be sure to include all output data from the algorithm(s).

![Figure 37](https://github.com/bwbaker1/APT_UserGuide_Figures/blob/main/APT_Figure37.png?raw=true "Figure 37. New data access related URLs added to the ATBD. The red outlined and numbered items correspond to numbered descriptions in text below.")

1. **URL** – Enter alternative data access mechanisms, such as links to machine services, ordering services, and Distributed Active Archive Center (DAAC) websites into this field.
2. **Description** – Enter a brief description of the provided alternative data access URL.
3. **Add** – This button allows any additional related URLs to be entered into the ATBD.

[[Back to top](#)]

#### 2.3.8 Closeout (Step 8)

This step describes the closeout section of the ATBD (Figure 38, 39 and 40). A summary (i.e., abstract), plain language summary and keywords are required for all ATBDs. Discussion and acknowledgments is only required for authors that intend to publish their ATBD with the American Geophysical Union (AGU) Wiley’s Earth and Space Science journal. In this section, authors will signify if they plan to submit the ATBD for a journal publication. The discussion section provides the value and implications of the algorithm along with any conclusions. Potential use cases can also be described in this section. All funding sources related to this work should be listed in the acknowledgements section. This section can also be used to thank any colleagues and other contributors. The AGU’s journal style guide documents can be found here: [Grammar and Style Guide](https://www.agu.org/Publish-with-AGU/Publish/Author-Resources/Grammar-Style-Guide#referenceformat) and [Text Requirements](https://www.agu.org/Publish-with-AGU/Publish/Author-Resources/Text-requirements).

![Figure 38](https://github.com/bwbaker1/APT_UserGuide_Figures/blob/main/APT_Figure38.png?raw=true "Figure 38. ATBD abstract and journal details. The red outlined and labeled items correspond to numbered descriptions in text below.")

1. **Short ATBD summary** – Brief summary that describes the ATBD in less than 250 words.
2. **Plain Language Summary** – Brief summary that describes the ATBD in short and simple terms.
3. **Keywords** – Add up to six keywords that can be used to aid online searches for this ATBD. APT utilizes keywords from the Global Change Master Directory (GCMD). Keywords from the GCMD will automatically populate as a user types into the search bar.
4. **Journal details** – Convey the publication plans for the ATBD. Options include: not to be submitted to AGU journal through APT; will be submitted to AGU’s Earth System Science journal through APT; already submitted to a journal;, and already published. Note: authors that select to publish the ATBD through APT will be required to include a discussion and acknowledgements (Figure 39).

![Figure 39](https://github.com/bwbaker1/APT_UserGuide_Figures/blob/main/APT_Figure39.png?raw=true "Figure 39. Discussion, data availability, and acknowledgments. The red outlined and labeled items correspond to numbered descriptions in text below.")

1. **Journal details** – Communicate whether or not you plan to submit this ATBD to the AGU’s Earth System Science journal.
2. **Significance discussion** – Describe the significance of the work and any implications or contributions to science.
3. **Open Research** – Provide a data availability statement for each dataset that supports this research.
4. **Acknowledgments list** – Provide a list of all funding sources related to this work for all authors into this field. This field can also be used to mention colleagues that helped support this work and other contributors. The format should be “first name and last name” or “first initial and last name.”

![Figure 40](https://github.com/bwbaker1/APT_UserGuide_Figures/blob/main/APT_Figure40.png?raw=true "Figure 40. Key points, potential reviewer, paper details, and author affirmations. The red outlined and labeled items correspond to the numbered descriptions in text below.")

1. **Key points** – Provide three key points of the research presented in this ATBD. These should be single spaced. APT will generate bullets for each key point;
2. **Potential reviewer** – Provide names and emails for three potential reviewers of this ATBD. Potential reviewers cannot be from the same institution and not be financially conflicted with this research.
3. **Paper length details** – This field displays the number of words, images and tables associated with this ATBD.
4. **Author affirmation** – Read the author affirmations for this work and you must click to affirm that these are correct and accurate for this ATBD.

[[Back to top](#)]

### 2.4 Rich Text Editor, Inserting Tables, and Uploading Figures

A LaTeX backend enables entry of rich content (e.g., tables, figures, references, and equations) that is necessary for scientific writing. Figures 41-43 show examples of using the rich content editor to format content, insert tables, and upload images into an ATBD. Inserting tables and figures is a relatively straightforward process; however, inserting equations using the equation editor requires knowledge of LaTeX mathematical commands. For guidance on inserting equations in APT, see the [LaTeX Help Manual for the Algorithm Publication Tool (APT)](https://www.earthdata.nasa.gov/apt/user-guide/latex). The use of a LaTeX backend allows authors to focus on writing scientific content and not formatting the document.

![Figure 41](https://github.com/bwbaker1/APT_UserGuide_Figures/blob/main/APT_Figure41.png?raw=true "Figure 41. APT’s rich content editor. The red outlined and labeled items correspond to numbered descriptions in text below.")

1. **Bulleted List** – This button inserts a bulleted list into the text box.
2. **Numbered List** – This button inserts a numbered list into the text box.
3. **Insert Equation** – This button inserts an equation into the text box. APT uses LaTeX to create equations. Inserting equations requires that authors have knowledge of LaTeX’s mathematical commands.
4. **Heading** – Create a new heading.
5. **Insert Reference** – This button provides an option to insert an existing reference(s) or to create a new one.
6. **Insert Table** – This button inserts a table into the ATBD (Figure 43)
7. **Insert Image** – This feature allows an author to upload an image and caption (Figure 44). Note that uploads must be in an image format.
8. **Undo** – Clicking this icon will undo the previous action.
9. **Redo** – Clicking this icon will redo the previous action.
10. **Keyboard shortcuts** – Prompt that displays various keyboard shortcuts related to general actions, contextual actions, inserting items, and formatting.

![Figure 42](https://github.com/bwbaker1/APT_UserGuide_Figures/blob/main/APT_FIgure42.png?raw=true "Figure 42. Insert tables using the rich content editor. The red outlined and labeled items correspond to numbered descriptions in text below.")

1. **Insert table** – This button inserts a table into the ATBD.
2. **Add row** – This button adds a row to the table.
3. **Remove row** – This button removes a row from the table.
4. **Add column** – This button adds a column to the table.
5. **Remove column** – This button removes a column from the table.
6. **Delete** – Clicking this icon deletes the table.
7. **Table cells** – Add table content into the table.
8. **Table caption** – Enter the desired caption into the table.

![Figure 43](https://github.com/bwbaker1/APT_UserGuide_Figures/blob/main/APT_Figure43.png?raw=true "Figure 43. Upload images using the rich content editor. The red outlined and labeled items correspond to numbered descriptions in text below.") 

1. **Upload an Image** – Use this button to select the desired image(s) to upload. Note that the image must be in an image format.
2. **Image Caption** – Enter the desired figure caption in this box.

## 3. Searching for ATBDs Using APT’s Centralized Repository

APT provides ATBDs in a centralized location in an effort to simplify discoverability of these documents. From APT’s main landing page, navigating to the Documents tab (see Figure 2) shows a list of all published ATBDs, which can be accessed and downloaded. Users can also utilize APT's search interface to search, access, and download ATBDs (Figure 45). Any user can search and view published ATBDs. This section provides an overview of the centralized ATBD repository.

![Figure 44](https://github.com/bwbaker1/APT_UserGuide_Figures/blob/main/APT_Figure44.png?raw=true "Figure 44. APT’s elastic search feature allows users to search and locate archived ATBDs from the centralized repository. The red outlined and labeled items correspond to numbered descriptions in text below.")

1. **Term** – Enter a search term into the search bar.
2. **Year** – Dropdown list that allows for filtering the search by year.
3. **Search** – This button performs the search.
