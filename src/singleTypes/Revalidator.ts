type Revalidator = (
	updater?: () => Promise<any> | any,
	revalidateAfterSetting?: boolean
) => Promise<any>;

export default Revalidator;
