import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAnalytics } from '../../slices/taskSlice';
import Styles from './Analytics.module.css';



export default function Analytics() {
    const dispatch = useDispatch();
    const { analytics, loading, error } = useSelector((state) => state.tasks);

    useEffect(() => {
        dispatch(fetchAnalytics());
    }, [dispatch]);

    if (error) return <p>Error: {error}</p>;

    return (
        <div className={Styles.analytics}>
            <p className={Styles.page_name}>Analytics</p>
            <div className={Styles.metrics}>
                {loading ? (
                    <SkeletonLoader />
                ) : (
                    <section className={Styles.task_category}>
                        <ul>
                            <li>
                                <span>Backlog Tasks</span>
                                <span>{analytics?.backlogTasks || 0}</span>
                            </li>
                            <li>
                                <span>To-Do Tasks</span>
                                <span>{analytics?.toDoTasks || 0}</span>
                            </li>
                            <li>
                                <span>In-Progress Tasks</span>
                                <span>{analytics?.inProgressTasks || 0}</span>
                            </li>
                            <li>
                                <span>Completed Tasks</span>
                                <span>{analytics?.completedTasks || 0}</span>
                            </li>
                        </ul>
                    </section>
                )}

                {loading ? (
                    <SkeletonLoader />
                ) : (
                    <section className={Styles.task_priorities}>
                        <ul>
                            <li>
                                <span>Low Priority Tasks</span>
                                <span>{analytics?.lowPriorityTasks || 0}</span>
                            </li>
                            <li>
                                <span>Moderate Priority</span>
                                <span>{analytics?.moderatePriorityTasks || 0}</span>
                            </li>
                            <li>
                                <span>High Priority</span>
                                <span>{analytics?.highPriorityTasks || 0}</span>
                            </li>
                            <li>
                                <span>Due Date Tasks</span>
                                <span>{analytics?.dueDateTasks || 0}</span>
                            </li>
                        </ul>
                    </section>
                )}
            </div>
        </div>
    );
}

function SkeletonLoader() {
    return (
        <div className={Styles.skeleton_container}>
            <div className={Styles.skeleton_items}>
                <span className={Styles.item1}></span>
                <span className={Styles.item2}></span>
            </div>
            <div className={Styles.skeleton_items}>
                <span className={Styles.item1}></span>
                <span className={Styles.item2}></span>
            </div>
            <div className={Styles.skeleton_items}>
                <span className={Styles.item1}></span>
                <span className={Styles.item2}></span>
            </div>
            <div className={Styles.skeleton_items}>
                <span className={Styles.item1}></span>
                <span className={Styles.item2}></span>
            </div>
        </div>
    );
}