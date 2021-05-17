import React from 'react';
import { Helmet } from "react-helmet"

const TitleComponent = ({ title }) => {
    var siteTitle = 'Just Means';
    return (
        <Helmet>
            <title>{(title ? (title + " | ") : null) + siteTitle}</title>
        </Helmet>
    );
};

export { TitleComponent };