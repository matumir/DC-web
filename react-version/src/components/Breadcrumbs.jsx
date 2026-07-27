import { Link } from "react-router-dom";

export default function Breadcrumbs({ items }) {
  return (
    <div className="breadcrumb">
      {items.map((item, i) => {
        const esUltimo = i === items.length - 1;
        return (
          <span key={i}>
            {esUltimo || !item.to ? (
              <span className={esUltimo ? "activo" : ""}>{item.label}</span>
            ) : (
              <Link to={item.to}>{item.label}</Link>
            )}
            {!esUltimo && " / "}
          </span>
        );
      })}
    </div>
  );
}
