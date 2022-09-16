import { Button } from "antd";
import { useState } from "react";
import { useLocation } from "react-router";
import { Link } from "react-router-dom";

export default function HeadNavigate()
{
    const location = useLocation();

    const [locations] = useState([
        { to: '/school_course', label: '课程列表' },
        { to: '/mark_homework', label: '批改作业' },
    ]);

    return (
        <header className="head-navigate">
            <div>
                {
                    locations.map(v =>
                        <Button key={v.to} size='large' type={location.pathname === v.to ? 'link' : 'text'}>
                            <Link to={v.to}>{v.label}</Link>
                        </Button>
                    )
                }
            </div>
        </header>
    );
}
