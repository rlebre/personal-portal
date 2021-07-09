import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import styles from "./category-button.module.scss";

interface Props {
  icon: IconDefinition;
  title: string;
  route?: string;
}

export const CategoryButton = ({ icon, title, route }: Props) => {
  return (
    <a className={styles.btn__category} href={route}>
      <FontAwesomeIcon icon={icon} className="w-6" />
      <span>{title}</span>
    </a>
  );
};
