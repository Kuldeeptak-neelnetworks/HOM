"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  baseInstance,
  errorToastingFunction,
  successToastingFunction,
} from "@/common/commonFunctions";
import { AxiosError } from "axios";
import { useWebsiteContentStore } from "@/Store/WebsiteContentStore";
import SelectReactSelect from "react-select";
import { useCustomerStore } from "@/Store/CustomerStore";
import Link from "next/link";

interface WebsiteContentDetailType {
  id: number;
  customer: any;
  typeOfCustomer: string;
  currentDomain: string;
  newDomain: string;
  domainInfo: string;
  domainTransferred: string[];
  registrarName: string;
  customerEmails: string[];
  emailsToBeCreated: string;
  existingEmailsAttached: string;
  theme: string;
  colours: string;
  companyLogo: string[];
  images: string[];
  notesForDesign: string;
  pageName: string;
  isCopywriterRequired: string[];
  contentRequired: string[];
  socialMedia: string;
  keyPhrasesAgreed: string;
  keyAreasAgreed: string;
  blogToBeAdded: string[];
  preferredPageNamesForBlog: string;
  googleReviews: string[];
  linkToCurrentGoogleReviews: string;
  contactInformation: string[];
  newContactInformation: string;
  notesForCopywriter: string;
  keywordforblogposts: string;
}

const EditWebsiteContent = () => {
  const router = useRouter();
  const [websiteContent, setWebsiteContent] =
    useState<WebsiteContentDetailType | null>(null);
  const [isWebsiteContentValid, setIsWebsiteContentValid] = useState(false);
  const { fetchWebsiteContentData }: any = useWebsiteContentStore();
  const { websiteContentId } = useParams();
  const getWebsiteContentDetails = async () => {
    try {
      const result = await baseInstance.get(`/newwebsite/${websiteContentId}`);
      if (result.status === 200) {
        const websiteData = result.data.data;
        setWebsiteContent(websiteData);
      }
    } catch (error) {
      console.error("Error fetching website content details:", error);
      if (error instanceof AxiosError) {
        errorToastingFunction(error.response?.data?.message);
      }
    }
  };
  useEffect(() => {
    fetchWebsiteContentData();
    getWebsiteContentDetails();
  }, []);

  const formik = useFormik({
    initialValues: {
      typeOfCustomer: websiteContent?.typeOfCustomer || "",
      currentDomain: websiteContent?.currentDomain || "",
      newDomain: websiteContent?.newDomain || "",
      domainInfo: websiteContent?.domainInfo || "",
      domainTransferred: websiteContent?.domainTransferred || [],
      registrarName: websiteContent?.registrarName || "",
      customerEmails: websiteContent?.customerEmails || [],
      emailsToBeCreated: websiteContent?.emailsToBeCreated || "",
      existingEmailsAttached: websiteContent?.existingEmailsAttached || "",
      theme: websiteContent?.theme || "",
      colours: websiteContent?.colours || "",
      companyLogo: websiteContent?.companyLogo || [],
      images: websiteContent?.images || [],
      notesForDesign: websiteContent?.notesForDesign || "",
      pageName: websiteContent?.pageName || "",
      isCopywriterRequired: websiteContent?.isCopywriterRequired || [],
      contentRequired: websiteContent?.contentRequired || [],
      socialMedia: websiteContent?.socialMedia || "",
      keyPhrasesAgreed: websiteContent?.keyPhrasesAgreed || "",
      keyAreasAgreed: websiteContent?.keyAreasAgreed || "",
      blogToBeAdded: websiteContent?.blogToBeAdded || [],
      preferredPageNamesForBlog:
        websiteContent?.preferredPageNamesForBlog || "",
      googleReviews: websiteContent?.googleReviews || [],
      linkToCurrentGoogleReviews:
        websiteContent?.linkToCurrentGoogleReviews || "",
      contactInformation: websiteContent?.contactInformation || [],
      newContactInformation: websiteContent?.newContactInformation || "",
      notesForCopywriter: websiteContent?.notesForCopywriter || "",
      keywordforblogposts: websiteContent?.keywordforblogposts || "",
    },
    validationSchema: () => {
      let schema = Yup.object().shape({
        typeOfCustomer: Yup.string().required("typeOfCustomer Required"),
      });

      if (formik.values.domainTransferred.includes("No")) {
        schema = schema.shape({
          registrarName: Yup.string().required("Registrar Required"),
        });
      }

      if (formik.values.isCopywriterRequired.includes("Yes")) {
        schema = schema.shape({
          // contentRequired: Yup.string().required("Content Required"),
          contentRequired: Yup.array()
            .of(Yup.string())
            .required("Content Required"),
        });
      }

      if (formik.values.blogToBeAdded.includes("Yes")) {
        schema = schema.shape({
          keywordforblogposts: Yup.string().required(
            "Keywords for blog posts Required"
          ),
        });
      }

      if (formik.values.googleReviews.includes("Currently Live")) {
        schema = schema.shape({
          linkToCurrentGoogleReviews: Yup.string().required(
            "Link to current Google Reviews Required"
          ),
        });
      }

      if (
        formik.values.contactInformation.includes("New Contact Information")
      ) {
        schema = schema.shape({
          newContactInformation: Yup.string().required(
            "New Contact Information Required"
          ),
        });
      }
      if (formik.values.customerEmails.includes("Create New Company Emails")) {
        schema = schema.shape({
          emailsToBeCreated: Yup.string().required(
            "Emails To Be Created Required"
          ),
        });
      }

      if (
        formik.values.customerEmails.includes(
          "Existing Emails Attached to Domain"
        )
      ) {
        schema = schema.shape({
          existingEmailsAttached: Yup.string().required(
            "Existing Emails Attached Required"
          ),
        });
      }

      return schema;
    },

    enableReinitialize: true,

    onSubmit: async (values) => {
      try {
        setIsWebsiteContentValid(() => true);
        const filteredData = Object.fromEntries(
          Object.entries(values).filter(
            ([_, value]) => value !== "" && value != null
          )
        );
        // console.log("filteredData", filteredData);
        const response = await baseInstance.patch(
          `/newwebsite/${websiteContentId}`,
          filteredData
        );
        // console.log("filteredData", filteredData);
        if (response?.status === 200) {
          successToastingFunction(response?.data?.message);
          setIsWebsiteContentValid(() => false);
          getWebsiteContentDetails();
          router.push("/websiteContent");
        } else {
          throw new Error("Something went wrong, Please try again later!");
        }
      } catch (error: any) {
        if (error?.response && error?.response?.data) {
          errorToastingFunction(error?.response?.data.message);
        }
      } finally {
        setIsWebsiteContentValid(() => false);
      }
    },
  });
  const {
    handleChange,
    handleBlur,
    handleSubmit,
    values,
    touched,
    errors,
    setFieldValue,
  } = formik;

  const baseOptions = [
    {
      value: "Create New Company Emails",
      label: "Create New Company Emails",
    },
    {
      value: "Existing Emails Attached to Domain",
      label: "Existing Emails Attached to Domain",
    },
    {
      value: "N/A - Customer Has Their Own",
      label: "N/A - Customer Has Their Own",
    },
  ];
  const option = [
    { value: "N/A", label: "N/A" },
    { value: "No", label: "No" },
    { value: "Yes(Our IPS Tag: 123-REG)", label: "Yes(Our IPS Tag: 123-REG)" },
  ];

  const options = [
    {
      value: "Create new company logo",
      label: "Create new company logo",
    },
    {
      value: "Logo file attached in monday",
      label: "Logo file attached in monday",
    },
    {
      value: "Take from current website",
      label: "Take from current website",
    },
    {
      value: "Added logo to general master",
      label: "Added logo to general master",
    },
  ];

  const imageOption = [
    {
      value: "Client to send & images attached in Monday.com",
      label: "Client to send & images attached in Monday.com",
    },
    {
      value: "Photographer to be booked",
      label: "Photographer to be booked",
    },
    {
      value: "Take from current website",
      Label: "Take from current website",
    },
  ];

  const copywriterRequiredOption = [
    { value: "Yes", label: "Yes" },
    { value: "No", label: "No" },
  ];

  const contentRequiredOption = [
    {
      value: "Additional Pages",
      label: "Additional Pages",
    },
    {
      value: "New content based on copywriter questionnaire",
      label: "New content based on copywriter questionnaire",
    },
    {
      value: "New content based on current website",
      label: "New content based on current website",
    },
    { value: "Non SEO", label: "Non SEO" },
    { value: "SEO", label: "SEO" },
    { value: "Rework", label: "Rework" },
    { value: "Blog Posts", label: "Blog Posts" },
  ];
  const blogToBeAddedOption = [
    { value: "Yes", label: "Yes" },
    { value: "No", label: "No" },
  ];

  const googleReviewsOption = [
    { value: "Currently Live", label: "Currently Live" },
    {
      value: "New Set-Up Required",
      label: "New Set-Up Required",
    },
    {
      value: "Yes",
      label: "Yes",
    },
  ];
  const contactInformationOption = [
    {
      value: "New Contact Information",
      label: "New Contact Information",
    },
    {
      value: "Use From Current Website",
      label: "Use From Current Website",
    },
  ];
  return (
    <div className="p-4 relative text-[0.8rem]">
      <div className="text-[1rem] font-semibold absolute top-[-50px] ">
        {websiteContent?.customer?.companyName
          ? websiteContent?.customer?.companyName
          : "loading..."}
      </div>

      <div className="flex justify-center">
        <div className="my-3 text-[0.8rem] hover:bg-gray-300 h-fit px-2 py-1 rounded cursor-pointer hidden text-center sm:block w-fit bg-[#fff] boxShadow">
          <Link href={`/websiteContent`}>Back</Link>
        </div>
        <ScrollArea className="h-[80vh]   px-3 py-3 w-[100%] xl:w-[56vw]">
          <form
            onSubmit={handleSubmit}
            className="border p-6 text-[0.8rem] bg-[#fff] boxShadow "
          >
            <div className="lg:flex gap-5">
              <div className="mb-3 w-full">
                <label className="mb-2.5 block font-medium text-black dark:text-white">
                  Type Of Customer
                </label>
                <div className="relative">
                  <Select
                    onValueChange={(value: any) =>
                      formik.setFieldValue("typeOfCustomer", value)
                    }
                    value={formik.values.typeOfCustomer}
                    name="typeOfCustomer"
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a type of customer" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Select</SelectLabel>
                        <SelectItem value="Renewal">Renewal</SelectItem>

                        <SelectItem value="New Customer">
                          New Customer
                        </SelectItem>
                        <SelectItem value="Existing HOM Customer">
                          Existing HOM Customer
                        </SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  {formik.touched.typeOfCustomer &&
                  formik.errors.typeOfCustomer ? (
                    <div className="text-red-500">
                      {formik.errors.typeOfCustomer}
                    </div>
                  ) : null}
                </div>
              </div>
              <div className="mb-3 w-full">
                <label className="mb-2.5 block font-medium text-black dark:text-white">
                  Current Domain
                </label>
                <div className="relative">
                  <input
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.currentDomain}
                    id="currentDomain"
                    name="currentDomain"
                    placeholder="Enter current domain"
                    className="w-full  border border-stroke bg-transparent py-2 pl-3 pr-10  outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>
              </div>
            </div>
            <div className="lg:flex gap-5">
              <div className="mb-3 w-full">
                <label className="mb-2.5 block font-medium text-black dark:text-white">
                  New Domain
                </label>
                <div className="relative">
                  <input
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.newDomain}
                    id="newDomain"
                    name="newDomain"
                    placeholder="Enter new domain"
                    className="w-full  border border-stroke bg-transparent py-2 pl-3 pr-10  outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>
              </div>
              <div className="mb-3 w-full">
                <label className="mb-2.5 block font-medium text-black dark:text-white">
                  Domain Info
                </label>
                <div className="relative">
                  <input
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.domainInfo}
                    id="domainInfo"
                    name="domainInfo"
                    placeholder="Enter domain info"
                    className="w-full  border border-stroke bg-transparent py-2 pl-3 pr-10  outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>
              </div>
            </div>

            <div className="lg:flex gap-5">
              <div className="mb-3 w-full">
                <label className="mb-2.5 block font-medium text-black dark:text-white">
                  Domain Transferred
                </label>

                <div className="relative">
                  <SelectReactSelect
                    classNamePrefix="react-select-custom-styling"
                    isMulti
                    onChange={(selectedOptions: any) => {
                      const values = selectedOptions
                        ? selectedOptions.map(
                            (option: { value: any }) => option.value
                          )
                        : [];
                      formik.setFieldValue("domainTransferred", values);
                    }}
                    options={option}
                    value={formik.values.domainTransferred
                      .filter((value) => value.trim() !== "")
                      .map((value: any) => ({
                        value,
                        label: value,
                      }))}
                  />
                </div>
              </div>

              {formik.values.domainTransferred.includes("No") && (
                <div className="mb-3 w-full">
                  <label className="mb-2.5 block font-medium text-black dark:text-white">
                    Registrar Name
                  </label>
                  <div className="relative">
                    <input
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.registrarName}
                      id="registrarName"
                      name="registrarName"
                      placeholder="Enter registrar Name"
                      className="w-full  border border-stroke bg-transparent py-2 pl-3 pr-10  outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                    {formik.touched.registrarName &&
                    formik.errors.registrarName ? (
                      <div className="text-red-500">
                        {formik.errors.registrarName}
                      </div>
                    ) : null}
                  </div>
                </div>
              )}
            </div>

            <div className="lg:flex gap-5">
              <div className="mb-3 w-full">
                <label className="mb-2.5 block font-medium text-black dark:text-white">
                  Customer Emails
                </label>

                <div className="relative">
                  <SelectReactSelect
                    classNamePrefix="react-select-custom-styling"
                    isMulti
                    onChange={(selectedOptions) => {
                      const values = selectedOptions
                        ? selectedOptions.map((option) => option.value)
                        : [];
                      formik.setFieldValue("customerEmails", values);
                    }}
                    options={baseOptions}
                    value={formik.values.customerEmails
                      .filter((value) => value.trim() !== "")
                      .map((value: any) => ({
                        value,
                        label: value,
                      }))}
                  />
                </div>
              </div>

              {formik.values.customerEmails.includes(
                "Create New Company Emails"
              ) && (
                <div className="mb-3 w-full">
                  <label className="mb-2.5 block font-medium text-black dark:text-white">
                    Emails To Be Created
                  </label>
                  <div className="relative">
                    <input
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={formik.values.emailsToBeCreated}
                      id="emailsToBeCreated"
                      name="emailsToBeCreated"
                      placeholder="Enter emails to be created"
                      className="w-full  border border-stroke bg-transparent py-2 pl-3 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                    {formik.touched.emailsToBeCreated &&
                    formik.errors.emailsToBeCreated ? (
                      <div className="text-red-500">
                        {formik.errors.emailsToBeCreated}
                      </div>
                    ) : null}
                  </div>
                </div>
              )}
              {formik.values.customerEmails.includes(
                "Existing Emails Attached to Domain"
              ) && (
                <div className="mb-3 w-full">
                  <label className="mb-2.5 block font-medium text-black dark:text-white">
                    Existing Emails Attached
                  </label>
                  <div className="relative">
                    <input
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={formik.values.existingEmailsAttached}
                      id="existingEmailsAttached"
                      name="existingEmailsAttached"
                      placeholder="Enter existing emails attached"
                      className="w-full  border border-stroke bg-transparent py-2 pl-3 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                    {formik.touched.existingEmailsAttached &&
                    formik.errors.existingEmailsAttached ? (
                      <div className="text-red-500">
                        {formik.errors.existingEmailsAttached}
                      </div>
                    ) : null}
                  </div>
                </div>
              )}
              {/* </> */}
              {/* ) : null} */}
            </div>

            <div className="lg:flex gap-5">
              <div className="mb-3 w-full">
                <label className="mb-2.5 block font-medium text-black dark:text-white">
                  Theme
                </label>
                <div className="relative">
                  <input
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.theme}
                    id="theme"
                    name="theme"
                    placeholder="Enter theme"
                    className="w-full  border border-stroke bg-transparent py-2 pl-3 pr-10  outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>
              </div>
              <div className="mb-3 w-full">
                <label className="mb-2.5 block font-medium text-black dark:text-white">
                  Colours
                </label>
                <div className="relative">
                  <input
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.colours}
                    id="colours"
                    name="colours"
                    placeholder="Enter colours"
                    className="w-full  border border-stroke bg-transparent py-2 pl-3 pr-10  outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>
              </div>
            </div>

            <div className="lg:flex gap-5">
              <div className="mb-3 w-full">
                <label className="mb-2.5 block font-medium text-black dark:text-white">
                  Company Logo
                </label>

                <div className="relative">
                  <SelectReactSelect
                    classNamePrefix="react-select-custom-styling"
                    isMulti
                    onChange={(selectedOptions: any) => {
                      const values = selectedOptions
                        ? selectedOptions.map(
                            (option: { value: any }) => option.value
                          )
                        : [];
                      formik.setFieldValue("companyLogo", values);
                    }}
                    options={options}
                    value={formik.values.companyLogo
                      .filter((value) => value.trim() !== "")
                      .map((value: any) => ({
                        value,
                        label: value,
                      }))}
                  />
                </div>
              </div>
              <div className="mb-3 w-full">
                <label className="mb-2.5 block font-medium text-black dark:text-white">
                  Images
                </label>

                <div className="relative">
                  <SelectReactSelect
                    classNamePrefix="react-select-custom-styling"
                    isMulti
                    onChange={(selectedOptions: any) => {
                      const values = selectedOptions
                        ? selectedOptions.map(
                            (option: { value: any }) => option.value
                          )
                        : [];
                      formik.setFieldValue("images", values);
                    }}
                    options={imageOption}
                    value={formik.values.images
                      .filter((value) => value.trim() !== "")
                      .map((value: any) => ({
                        value,
                        label: value,
                      }))}
                  />
                </div>
              </div>
            </div>
            <div className="lg:flex gap-5">
              <div className="mb-3 w-full">
                <label className="mb-2.5 block font-medium text-black dark:text-white">
                  Notes For Design
                </label>
                <div className="relative">
                  <input
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.notesForDesign}
                    id="notesForDesign"
                    name="notesForDesign"
                    placeholder="Enter notes for design"
                    className="w-full  border border-stroke bg-transparent py-2 pl-3 pr-10  outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>
              </div>
            </div>

            <div className="lg:flex gap-5">
              <div className="mb-3 w-full">
                <label className="mb-2.5 block font-medium text-black dark:text-white">
                  Is Copywriter Required
                </label>

                <div className="relative">
                  <SelectReactSelect
                    classNamePrefix="react-select-custom-styling"
                    // onChange={(selectedOptions: any) => {
                    //   const values = selectedOptions
                    //     ? selectedOptions.map(
                    //         (option: { value: any }) => option.value
                    //       )
                    //     : [];
                    //   formik.setFieldValue("isCopywriterRequired", values);
                    // }}
                    onChange={(selectedOption: any) => {
                      const value = selectedOption ? selectedOption.value : "";
                      formik.setFieldValue("isCopywriterRequired", value);
                    }}
                    options={copywriterRequiredOption}
                    value={
                      formik.values.isCopywriterRequired
                        ? {
                            value: formik.values.isCopywriterRequired,
                            label: formik.values.isCopywriterRequired,
                          }
                        : null
                    }
                    // value={formik.values.isCopywriterRequired
                    //   .filter((value) => value.trim() !== "")
                    //   .map((value: any) => ({
                    //     value,
                    //     label: value,
                    //   }))}
                    // value={isCopywriterRequired}
                  />
                </div>
              </div>
              {formik.values.isCopywriterRequired.includes("Yes") && (
                <div className="mb-3 w-full">
                  <label className="mb-2.5 block font-medium text-black dark:text-white">
                    Content Required
                  </label>

                  <div className="relative">
                    <SelectReactSelect
                      classNamePrefix="react-select-custom-styling"
                      isMulti
                      onChange={(selectedOptions: any) => {
                        const values = selectedOptions
                          ? selectedOptions.map(
                              (option: { value: any }) => option.value
                            )
                          : [];
                        formik.setFieldValue("contentRequired", values);
                      }}
                      options={contentRequiredOption}
                      value={formik.values.contentRequired
                        .filter((value) => value.trim() !== "")
                        .map((value: any) => ({
                          value,
                          label: value,
                        }))}
                    />
                    {formik.touched.contentRequired &&
                    formik.errors.contentRequired ? (
                      <div className="text-red-500">
                        {formik.errors.contentRequired}
                      </div>
                    ) : null}
                  </div>
                </div>
              )}
            </div>

            <div className="lg:flex gap-5">
              <div className="mb-3 w-full">
                <label className="mb-2.5 block font-medium text-black dark:text-white">
                  Page Name
                </label>
                <div className="relative">
                  <input
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.pageName}
                    id="pageName"
                    name="pageName"
                    placeholder="Enter page name"
                    className="w-full  border border-stroke bg-transparent py-2 pl-3 pr-10  outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>
              </div>
              <div className="mb-3 w-full">
                <label className="mb-2.5 block font-medium text-black dark:text-white">
                  Social Media
                </label>
                <div className="relative">
                  <input
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.socialMedia}
                    id="socialMedia"
                    name="socialMedia"
                    placeholder="Enter social media"
                    className="w-full  border border-stroke bg-transparent py-2 pl-3 pr-10  outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>
              </div>
            </div>

            <div className="lg:flex gap-5">
              <div className="mb-3 w-full">
                <label className="mb-2.5 block font-medium text-black dark:text-white">
                  Key Phrases Agreed
                </label>
                <div className="relative">
                  <input
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.keyPhrasesAgreed}
                    id="keyPhrasesAgreed"
                    name="keyPhrasesAgreed"
                    placeholder="Enter key phrases agreed"
                    className="w-full  border border-stroke bg-transparent py-2 pl-3 pr-10  outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>
              </div>
              <div className="mb-3 w-full">
                <label className="mb-2.5 block font-medium text-black dark:text-white">
                  Key Areas Agreed
                </label>
                <div className="relative">
                  <input
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.keyAreasAgreed}
                    id="keyAreasAgreed"
                    name="keyAreasAgreed"
                    placeholder="Enter key areas agreed"
                    className="w-full  border border-stroke bg-transparent py-2 pl-3 pr-10  outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>
              </div>
            </div>

            <div className="lg:flex gap-5">
              <div className="mb-3 w-full">
                <label className="mb-2.5 block font-medium text-black dark:text-white">
                  Blog To Be Added
                </label>
                <div className="relative">
                  <SelectReactSelect
                    classNamePrefix="react-select-custom-styling"
                    isMulti
                    onChange={(selectedOptions: any) => {
                      const values = selectedOptions
                        ? selectedOptions.map(
                            (option: { value: any }) => option.value
                          )
                        : [];
                      formik.setFieldValue("blogToBeAdded", values);
                    }}
                    options={blogToBeAddedOption}
                    value={formik.values.blogToBeAdded
                      .filter((value) => value.trim() !== "")
                      .map((value: any) => ({
                        value,
                        label: value,
                      }))}
                  />
                </div>
              </div>
              {formik.values.blogToBeAdded.includes("Yes") && (
                <div className="mb-3 w-full">
                  <label className="mb-2.5 block font-medium text-black dark:text-white">
                    Keyword for blog posts
                  </label>
                  <div className="relative">
                    <input
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.keywordforblogposts}
                      id="keywordforblogposts"
                      name="keywordforblogposts"
                      placeholder="Enter keyword for blog posts"
                      className="w-full  border border-stroke bg-transparent py-2 pl-3 pr-10  outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                    {formik.touched.keywordforblogposts &&
                    formik.errors.keywordforblogposts ? (
                      <div className="text-red-500">
                        {formik.errors.keywordforblogposts}
                      </div>
                    ) : null}
                  </div>
                </div>
              )}
            </div>
            <div className="lg:flex gap-5">
              <div className="mb-3 w-full">
                <label className="mb-2.5 block font-medium text-black dark:text-white">
                  Google Reviews
                </label>

                <div className="relative">
                  <SelectReactSelect
                    classNamePrefix="react-select-custom-styling"
                    isMulti
                    onChange={(selectedOptions: any) => {
                      const values = selectedOptions
                        ? selectedOptions.map(
                            (option: { value: any }) => option.value
                          )
                        : [];
                      formik.setFieldValue("googleReviews", values);
                    }}
                    value={formik.values.googleReviews
                      .filter((value) => value.trim() !== "")
                      .map((value: any) => ({
                        value,
                        label: value,
                      }))}
                    options={googleReviewsOption}
                  />
                </div>
              </div>
              {formik.values.googleReviews.includes("Currently Live") && (
                <div className="mb-3 w-full">
                  <label className="mb-2.5 block font-medium text-black dark:text-white">
                    Link To Current Google Reviews
                  </label>
                  <div className="relative">
                    <input
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.linkToCurrentGoogleReviews}
                      id="linkToCurrentGoogleReviews"
                      name="linkToCurrentGoogleReviews"
                      placeholder="Enter link to current google reviews"
                      className="w-full  border border-stroke bg-transparent py-2 pl-3 pr-10  outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                    {formik.touched.linkToCurrentGoogleReviews &&
                    formik.errors.linkToCurrentGoogleReviews ? (
                      <div className="text-red-500">
                        {formik.errors.linkToCurrentGoogleReviews}
                      </div>
                    ) : null}
                  </div>
                </div>
              )}
            </div>

            <div className="lg:flex gap-5">
              <div className="mb-3 w-full">
                <label className="mb-2.5 block font-medium text-black dark:text-white">
                  Contact Information
                </label>

                <div className="relative">
                  <SelectReactSelect
                    classNamePrefix="react-select-custom-styling"
                    isMulti
                    onChange={(selectedOptions: any) => {
                      const values = selectedOptions
                        ? selectedOptions.map(
                            (option: { value: any }) => option.value
                          )
                        : [];
                      formik.setFieldValue("contactInformation", values);
                    }}
                    value={formik.values.contactInformation
                      .filter((value) => value.trim() !== "")
                      .map((value: any) => ({
                        value,
                        label: value,
                      }))}
                    options={contactInformationOption}
                  />
                  {formik.touched.contactInformation &&
                  formik.errors.contactInformation ? (
                    <div className="text-red-500">
                      {formik.errors.contactInformation}
                    </div>
                  ) : null}
                </div>
              </div>
              {formik.values.contactInformation.includes(
                "New Contact Information"
              ) && (
                <div className="mb-3 w-full">
                  <label className="mb-2.5 block font-medium text-black dark:text-white">
                    New Contact Information
                  </label>
                  <div className="relative">
                    <input
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.newContactInformation}
                      id="newContactInformation"
                      name="newContactInformation"
                      placeholder="Enter new contact information"
                      className="w-full  border border-stroke bg-transparent py-2 pl-3 pr-10  outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                    {formik.touched.newContactInformation &&
                    formik.errors.newContactInformation ? (
                      <div className="text-red-500">
                        {formik.errors.newContactInformation}
                      </div>
                    ) : null}
                  </div>
                </div>
              )}
            </div>

            <div className="mb-3 w-full">
              <label className="mb-2.5 block font-medium text-black dark:text-white">
                Notes For Copywriter
              </label>
              <div className="relative">
                <input
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.notesForCopywriter}
                  id="notesForCopywriter"
                  name="notesForCopywriter"
                  placeholder="Enter notes for copywriter"
                  className="w-full  border border-stroke bg-transparent py-2 pl-3 pr-10  outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
              </div>
            </div>

            <div className="mb-3 w-full">
              <label className="mb-2.5 block font-medium text-black dark:text-white">
                Preferred Page Names For Blog
              </label>
              <div className="relative">
                <input
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.preferredPageNamesForBlog}
                  id="preferredPageNamesForBlog"
                  name="preferredPageNamesForBlog"
                  placeholder="Enter preferred page names for blog"
                  className="w-full  border border-stroke bg-transparent py-2 pl-3 pr-10  outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
              </div>
            </div>

            <div className="my-6 ">
              <Button
                type="submit"
                className="lg:w-[6vw] cursor-pointer  border border-primary bg-primary px-4 py-1 text-white transition hover:bg-opacity-90 text-md"
              >
                {isWebsiteContentValid ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  "Submit"
                )}
              </Button>
            </div>
          </form>
        </ScrollArea>
      </div>
    </div>
  );
};

export default EditWebsiteContent;
