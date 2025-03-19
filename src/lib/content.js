/**
 * SITE CONTENT CONFIGURATION
 * 
 * This file contains all the editable content for the website.
 * Edit the values below to update the content on the site.
 * 
 * IMPORTANT: After making changes, save this file and refresh the browser
 * to see your changes.
 */

export const siteConfig = {
  // Site-wide configuration
  siteName: "Ben Mak",
  siteDescription: "Expert Witness & Forensic Consultant",
  contactEmail: "consult@justice-minds.com",
  
  // Navigation links
  navigation: [
    { title: "Ben Mak Home", url: "/" },
    { title: "Endorsements", url: "/endorsements" },
    { title: "Certification", url: "/certificates" },
    { title: "Portal", url: "/portal" },
    { title: "Analytics", url: "/analytics" },
    { title: "Contact Us", url: "/contact", isButton: true }
  ],
  
  // Home page content
  homePage: {
    headline: "Ben Mak",
    subheadline: "Expert Witness & Forensic Consultant",
    introduction: `Ben Mak is a highly respected expert witness and forensic consultant
      with extensive experience in providing expert testimony and analysis in complex cases.`,
    // Add more home page content as needed
  },
  
  // Endorsements page content
  endorsements: [
    {
      id: "parliamentary",
      title: "PARLIAMENTARY ENDORSEMENT",
      subtitle: "HOUSE OF COMMONS RECOGNITION",
      logo: "/assets/organized/logos/processed_house commons.png",
      content: "Ben's advocacy has been recognized at the highest levels of government, with direct support from Dan Carden MP and Liverpool City Council's Chief Executive Tony Reeves.",
      quote: {
        text: "Dear Ben, Thank you for recently contacting my office about your concerns...I hope my support and contacting Liverpool City Council for a referral to social services has been of some assistance and helped towards this.",
        author: "Parliamentary - Tony"
      }
    },
    {
      id: "local-authority",
      title: "LOCAL AUTHORITY RECOGNITION",
      subtitle: "PRACTITIONER ENDORSEMENT",
      logo: "/assets/organized/logos/processed_lpool city counil .png",
      content: "Ben's committed work on Liverpool City Council to supporting and enhancing service provision and relationships has been acknowledged by 19 years Fostering experience."
    },
    {
      id: "westminster",
      title: "WESTMINSTER ENDORSEMENT",
      subtitle: "CITY COUNCIL RECOGNITION",
      logo: "/assets/organized/logos/processed_city westminster.png",
      content: "Ben's expertise in policy development and implementation has been recognized by Westminster City Council for its impact on community services."
    }
    // You can add more endorsements here
  ],
  
  // Certificates page content
  certificates: {
    headline: "CERTIFICATIONS & QUALIFICATIONS",
    introduction: "Ben Mak holds numerous professional certifications and qualifications that demonstrate his expertise and commitment to excellence in his field.",
    certificatesList: [
      {
        title: "Forensic Analysis Certification",
        issuer: "National Institute of Forensic Science",
        date: "2022",
        image: "/assets/organized/certificates/Finder 2025-02-12 08.46.26.png"
      },
      {
        title: "Expert Witness Qualification",
        issuer: "UK Legal Institute",
        date: "2021",
        image: "/assets/organized/certificates/Finder 2025-02-12 08.46.31.png"
      },
      {
        title: "Advanced Digital Forensics",
        issuer: "Cyber Security Academy",
        date: "2023",
        image: "/assets/organized/certificates/Finder 2025-02-12 08.46.44.png"
      }
      // You can add more certificates here
    ]
  }
};

/**
 * HELPER FUNCTIONS
 * These functions help with accessing content in different formats
 */

// Get navigation links
export function getNavLinks() {
  return siteConfig.navigation;
}

// Get all endorsements
export function getAllEndorsements() {
  return siteConfig.endorsements;
}

// Get a specific endorsement by ID
export function getEndorsementById(id) {
  return siteConfig.endorsements.find(endorsement => endorsement.id === id);
}

// Get all certificates
export function getAllCertificates() {
  return siteConfig.certificates.certificatesList;
}
