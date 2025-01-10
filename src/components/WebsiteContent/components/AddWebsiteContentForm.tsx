"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import SelectReactSelect from "react-select";
import SelectDomainTransferred from "react-select";
import SelectCustomerEmails from "react-select";
import SelectIsCopywriterRequired from "react-select";
import SelectBlogToBeAdded from "react-select";
import { errorToastingFunction } from "@/common/commonFunctions";
import { Loader2 } from "lucide-react";
import { LoaderIconSVG } from "@/utils/SVGs/SVGs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCustomerStore } from "@/Store/CustomerStore";
import { useWebsiteContentStore } from "@/Store/WebsiteContentStore";

const AddWebsiteContentForm = ({}: any) => {
  const router = useRouter();
  const [customerLoading, setCustomerLoading] = useState(false);
  const [isWebsiteContentValid, setIsWebsiteContentValid] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState("");
  const { fetchAllCustomerData, customerData }: any = useCustomerStore();
  const {
    addWebsiteContentData,
    fetchWebsiteContentData,
    websiteContentData,
  }: any = useWebsiteContentStore();

  useEffect(() => {
    fetchAllCustomerData();
  }, []);
  const formik = useFormik({
    initialValues: {
      typeOfCustomer: "",
      currentDomain: "",
      newDomain: "",
      domainInfo: "",
      domainTransferred: "",
      registrarName: "",
      customerEmails: "",
      emailsToBeCreated: "",
      existingEmailsAttached: "",
      theme: "",
      colours: "",
      companyLogo: "",
      images: "",
      notesForDesign: "",
      pageName: "",
      isCopywriterRequired: "",
      contentRequired: "",
      socialMedia: "",
      keyPhrasesAgreed: "",
      keyAreasAgreed: "",
      blogToBeAdded: "",
      preferredPageNamesForBlog: "",
      googleReviews: "",
      linkToCurrentGoogleReviews: "",
      contactInformation: "",
      newContactInformation: "",
      notesForCopywriter: "",
      selectedCustomerId: "",
      keyWordForBlogPosts: "",
    },
    validationSchema: () => {
      let schema = Yup.object().shape({
        selectedCustomerId: Yup.string().required("Company Name Required"),
        typeOfCustomer: Yup.string().required("typeOfCustomer Required"),
      });

      if (formik.values.domainTransferred === "No") {
        schema = schema.shape({
          registrarName: Yup.string().required("Registrar Required"),
        });
      }

      if (formik.values.isCopywriterRequired === "Yes") {
        schema = schema.shape({
          contentRequired: Yup.array().required("Content Required"),
        });
      }

      if (formik.values.blogToBeAdded === "Yes") {
        schema = schema.shape({
          keyWordForBlogPosts: Yup.string().required(
            "Keywords for blog posts Required"
          ),
        });
      }

      if (formik.values.googleReviews === "Currently Live") {
        schema = schema.shape({
          linkToCurrentGoogleReviews: Yup.string().required(
            "Link to current Google Reviews Required"
          ),
        });
      }
      if (formik.values.contactInformation === "New Contact Information") {
        schema = schema.shape({
          newContactInformation: Yup.string().required(
            "New Contact Information Required"
          ),
        });
      }

      if (formik.values.customerEmails === "Create New Company Emails") {
        schema = schema.shape({
          emailsToBeCreated: Yup.string().required(
            "Emails To Be Created Required"
          ),
        });
      }

      if (
        formik.values.customerEmails === "Existing Emails Attached to Domain"
      ) {
        schema = schema.shape({
          existingEmailsAttached: Yup.string().required(
            "Existing Emails Attached Required"
          ),
        });
      }

      return schema;
    },

    onSubmit: async (values) => {
      try {
        setCustomerLoading(() => true);
        setIsWebsiteContentValid(() => true);

        const data = {
          typeOfCustomer: values.typeOfCustomer,
          currentDomain: values.currentDomain,
          newDomain: values.newDomain,
          domainInfo: values.domainInfo,
          domainTransferred: values.domainTransferred,
          registrarName: values.registrarName,
          customerEmails: values.customerEmails,
          emailsToBeCreated: values.emailsToBeCreated,
          existingEmailsAttached: values.existingEmailsAttached,
          theme: values.theme,
          colours: values.colours,
          companyLogo: values.companyLogo,
          images: values.images,
          notesForDesign: values.notesForDesign,
          pageName: values.pageName,
          isCopywriterRequired: values.isCopywriterRequired,
          contentRequired: values.contentRequired,
          socialMedia: values.socialMedia,
          keyPhrasesAgreed: values.keyPhrasesAgreed,
          keyAreasAgreed: values.keyAreasAgreed,
          blogToBeAdded: values.blogToBeAdded,
          preferredPageNamesForBlog: values.preferredPageNamesForBlog,
          googleReviews: values.googleReviews,
          linkToCurrentGoogleReviews: values.linkToCurrentGoogleReviews,
          contactInformation: values.contactInformation,
          newContactInformation: values.newContactInformation,
          notesForCopywriter: values.notesForCopywriter,
          keyWordForBlogPosts: values.keyWordForBlogPosts,
        };

        await addWebsiteContentData(data, selectedCustomerId);
        if (
          Array.isArray(websiteContentData) &&
          websiteContentData.length !== 0
        ) {
          router.push("/websiteContent");
          await fetchWebsiteContentData();
        }
      } catch (error: any) {
        if (error?.response && error?.response?.data) {
          errorToastingFunction(error?.response?.data.message);
        } else {
          errorToastingFunction(error?.response?.data.message);
        }
      } finally {
        setIsWebsiteContentValid(() => false);
        setCustomerLoading(() => false);
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
    setFieldTouched,
  } = formik;

  useEffect(() => {
    fetchAllCustomerData();
  }, []);

  return (
    <>
      <div className="p-4 relative">
        <div className="text-[1rem] font-semibold absolute top-[-50px]">
          Add Website Content
        </div>

        <div className="flex justify-center">
          <ScrollArea className="h-[80vh]   px-3 py-3 w-[100%] xl:w-[56vw]">
            <form
              onSubmit={handleSubmit}
              className="border p-6 text-[0.8rem] bg-[#fff]  boxShadow"
            >
              <div className="mb-3 mt-3">
                <label className="mb-2.5 block font-medium text-black dark:text-white">
                  Select Company <span style={{ opacity: "0.5" }}> * </span>
                </label>
                <div className="relative">
                  {!customerData?.customers ? (
                    <div className="flex justify-start">
                      <LoaderIconSVG />
                      <span className="px-2">Loading...</span>
                    </div>
                  ) : (
                    <SelectReactSelect
                      classNamePrefix="react-select-custom-styling"
                      closeMenuOnSelect={true}
                      isClearable={true}
                      options={customerData.customers.map((customer: any) => ({
                        value: customer._id,
                        label: customer.companyName,
                      }))}
                      onChange={(selectedOption: { value: string } | null) => {
                        const customerId = selectedOption
                          ? selectedOption.value
                          : "";
                        setSelectedCustomerId(customerId);
                        formik.setFieldValue("selectedCustomerId", customerId);
                      }}
                      placeholder="Select a Company"
                    />
                  )}
                  {formik.touched.selectedCustomerId &&
                  formik.errors.selectedCustomerId ? (
                    <div className="text-red-500">
                      {formik.errors.selectedCustomerId}
                    </div>
                  ) : null}
                </div>
              </div>

              <div className="lg:flex gap-5">
                <div className="mb-3 w-full">
                  <label className="mb-2.5 block font-medium text-black dark:text-white">
                    Type Of Customer <span style={{ opacity: "0.5" }}> * </span>
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
                      options={[
                        { value: "N/A", label: "N/A" },
                        { value: "No", label: "No" },
                        {
                          value: "Yes(Our IPS Tag: 123-REG)",
                          label: "Yes(Our IPS Tag: 123-REG)",
                        },
                      ]}
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
                      onChange={(selectedOptions: any) => {
                        const values = selectedOptions
                          ? selectedOptions.map(
                              (option: { value: any }) => option.value
                            )
                          : [];
                        formik.setFieldValue("customerEmails", values);
                      }}
                      options={[
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
                      ]}
                    />
                    {formik.touched.customerEmails &&
                    formik.errors.customerEmails ? (
                      <div className="text-red-500">
                        {formik.errors.customerEmails}
                      </div>
                    ) : null}
                  </div>
                </div>
                {/* {formik.values.customerEmails.includes(
                  "Create New Company Emails"
                ) ||
                formik.values.customerEmails.includes(
                  "Existing Emails Attached to Domain"
                ) ? (
                  <> */}
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
                      options={[
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
                      ]}
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
                      options={[
                        {
                          value:
                            "Client to send & images attached in Monday.com",
                          label:
                            "Client to send & images attached in Monday.com",
                        },
                        {
                          value: "Photographer to be booked",
                          label: "Photographer to be booked",
                        },
                        {
                          value: "Take from current website",
                          Label: "Take from current website",
                        },
                      ]}
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
                      options={[
                        { value: "Yes", label: "Yes" },
                        { value: "No", label: "No" },
                      ]}
                      // onChange={(selectedOptions: any) => {
                      //   const values = selectedOptions
                      //     ? selectedOptions?.map(
                      //         (option: { value: any }) => option.value
                      //       )
                      //     : [];

                      //   formik.setFieldValue("isCopywriterRequired", values);
                      // }}
                      onChange={(selectedOption: any) => {
                        const value = selectedOption
                          ? selectedOption.value
                          : "";
                        formik.setFieldValue("isCopywriterRequired", value);
                      }}
                    />
                    {/* {formik.touched.isCopywriterRequired &&
                    formik.errors.isCopywriterRequired ? (
                      <div className="text-red-500">
                        {formik.errors.isCopywriterRequired}
                      </div>
                    ) : null} */}
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
                        options={[
                          {
                            value: "Additional Pages",
                            label: "Additional Pages",
                          },
                          {
                            value:
                              "New content based on copywriter questionnaire",
                            label:
                              "New content based on copywriter questionnaire",
                          },
                          {
                            value: "New content based on current website",
                            label: "New content based on current website",
                          },
                          { value: "Non SEO", label: "Non SEO" },
                          { value: "SEO", label: "SEO" },
                          { value: "Rework", label: "Rework" },
                          { value: "Blog Posts", label: "Blog Posts" },
                        ]}
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
                      options={[
                        { value: "Yes", label: "Yes" },
                        { value: "No", label: "No" },
                      ]}
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
                        value={values.keyWordForBlogPosts}
                        id="keyWordForBlogPosts"
                        name="keyWordForBlogPosts"
                        placeholder="Enter keyword for blog posts"
                        className="w-full  border border-stroke bg-transparent py-2 pl-3 pr-10  outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      />
                      {formik.touched.keyWordForBlogPosts &&
                      formik.errors.keyWordForBlogPosts ? (
                        <div className="text-red-500">
                          {formik.errors.keyWordForBlogPosts}
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
                      options={[
                        { value: "Currently Live", label: "Currently Live" },
                        {
                          value: "New Set-Up Required",
                          label: "New Set-Up Required",
                        },
                        {
                          value: "Yes",
                          label: "Yes",
                        },
                      ]}
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
                      options={[
                        {
                          value: "New Contact Information",
                          label: "New Contact Information",
                        },
                        {
                          value: "Use From Current Website",
                          label: "Use From Current Website",
                        },
                      ]}
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
    </>
  );
};

export default AddWebsiteContentForm;
