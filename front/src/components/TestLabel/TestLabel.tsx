import React from 'react';
import './testLabel.scss';

type TestLabel = {
  title: string;
};

export const TestLabel: React.FC<TestLabel> = ({ title }: TestLabel) => {
  return <p className="general-TestLabel-title">{title}</p>;
};

