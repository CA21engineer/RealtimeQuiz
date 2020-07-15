import React from 'react';
import cx from 'classnames';
import './questionContent.scss';

type QuestionContentProps = {
  content: string;
  className?: string;
};

export const QuestionContent: React.FC<QuestionContentProps> = ({
  className,
  content,
}: QuestionContentProps) => {
  /* eslint no-useless-escape: 0 */
  const getUrlFromContent = () => {
    const urlExpression = /https?:\/\/[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/;
    const urlList = content.match(new RegExp(urlExpression));

    if (!urlList || !urlList.length) {
      return null;
    }

    const url = urlList[0];
    return url;
  };

  const url = getUrlFromContent();
  const text = content.replace(url || '', '');

  return (
    <div className="QuestionContent__wrapper">
      {url && (
        <img
          className={cx('QuestionContent__img', className)}
          src={url}
          alt=""
        />
      )}
      {text && <p className="QuestionContent__text">{text}</p>}
    </div>
  );
};

