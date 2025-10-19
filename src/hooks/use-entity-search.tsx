import { PAGINATION } from "@/config/constants";
import { useEffect, useState } from "react";

interface UseEntitySearchProps<T extends { search: string, page: number }> {
    params: T;
    setParams: (params: T) => void;
    debounceMs?: number
}

export function useEntitySearch<T extends { search: string, page: number }>({ params, setParams, debounceMs = 500 }: UseEntitySearchProps<T>) {
    const [search, setSearch] = useState(params.search)

    useEffect(() => {
        if (search === '' && params.search !== '') {
            setParams({
                ...params,
                search: '',
                page: PAGINATION.DEFAULT_PAGE
            })
            return;
        }
        const timer = setTimeout(() => {
            if (search !== params.search) {
                setParams({
                    ...params,
                    search,
                    page: PAGINATION.DEFAULT_PAGE
                })
            }
        }, debounceMs)

        return () => clearTimeout(timer)
    }, [search, params, setParams, debounceMs])

    useEffect(() => {
        setSearch(params.search)
    }, [params.search])

    return {
        searchValue: search,
        onSearchChange: setSearch
    }
}