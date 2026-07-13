export default function CustomTabPanel(props: TabPanelProps) {
  const { children, value, innerDivClassName, wrapperClassName, index, ...other } = props;

  return (
    <div
      className={wrapperClassName ?? ''}
      role='tabpanel'
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      style={{ display: value !== index ? 'none' : undefined }}
      {...other}
    >
      {value === index && <div className={innerDivClassName ?? ''}>{children}</div>}
    </div>
  );
}
