import options from "./options-services-by-zattire";

options.map((category) => {
  category.services.map((service: any) => {
    let sname = service.service_name;
    service.options.map((option: any) => {
      if (option.option_name.toLowerCase() === "default") {
        option.option_name = sname;
      }
    });
  });
});

export default options;
